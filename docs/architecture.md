# Architecture du moteur FID-Copilot

Documentation technique du pipeline de recherche juridique et de la base de connaissances FID.

---

## 1. Vue d'ensemble

FID-Copilot assiste les directeurs d'ecole en formation FID (Formation Initiale des Directeurs, Federation Wallonie-Bruxelles). Le moteur combine une base de textes juridiques, un systeme de routage thematique, et un LLM pour repondre a des questions d'examen ou de terrain.

### Composants principaux

| Composant | Fichier(s) | Role |
|-----------|-----------|------|
| **legal_chunks** | Table Supabase | Stocke les articles de loi decoupes en chunks indexables par CDA et article |
| **gallilex.ts** | `src/lib/ai/gallilex.ts` | Registre des CDA, routage thematique, detection de pivots |
| **THEME_CDA_MAP** | dans `gallilex.ts` | Associe des mots-cles a des codes CDA pour orienter la recherche |
| **PIVOT_ARTICLE_MAP** | dans `gallilex.ts` | Associe des mots-cles a des articles precis qui doivent etre injectes |
| **Prompt systeme** | `src/lib/ai/prompt.ts` | Construit le prompt avec regles anti-hallucination, concordances, consignes FID |
| **Routes API** | `src/app/api/assistant/route.ts`, `src/app/api/decision/route.ts` | Pipeline complet : auth, recherche, construction du contexte, appel LLM |
| **Tests** | `src/__tests__/*.test.ts` | 140 tests de non-regression (routage, presence en base, pipeline) |
| **Matrice de couverture** | `src/__tests__/fid-coverage-matrix.ts` | Suivi du statut des 15 cas FID critiques |

---

## 2. Pipeline detaille

```
Question utilisateur
        |
        v
  [1] Extraction de mots-cles
        |  extractKeywords() — retire les stop words, normalise
        v
  [2] Detection d'intent
        |  detectIntent() — juridique / portfolio / direction / organisation / general
        v
  [3] Scoring des documents
        |  scoreDocument() — croise intent, categorie, CDA, mots-cles
        |  → Top 7 documents selectionnes
        v
  [4] Routage CDA (Gallilex)
        |  searchGallilex(keywords, docCdaCodes)
        |  → THEME_CDA_MAP identifie les CDA pertinents
        |  → Fusion CDA des documents + CDA Gallilex (dedupliques)
        v
  [5] Recherche FTS (Full-Text Search)
        |  Supabase .textSearch("content", tsQuery, { config: "french" })
        |  Filtre : cda_code IN (allCdaCodes)
        |  → Jusqu'a 8 chunks classes par pertinence PostgreSQL
        v
  [6] Pivot injection
        |  findPivotArticles(keywords)
        |  → PIVOT_ARTICLE_MAP identifie les articles critiques
        |  → Fetch par article_number exact (pas FTS)
        |  → Fusion : pivots d'abord, puis FTS (dedupliques par cda:article)
        v
  [7] Construction du contexte
        |  Budget : 8000 chars max pour les extraits juridiques
        |  Format : [LEGAL-N] + citation + CDA + article + extrait
        |  Gallilex : references complementaires si CDA non indexes
        v
  [8] Prompt systeme
        |  buildSystemPrompt(docs, mode)
        |  → Regles anti-hallucination, concordances legales, consignes FID
        v
  [9] Appel LLM
        |  Gemini 2.5 Flash (primaire), GPT-4o-mini (fallback)
        |  systemPrompt + userMessage (question + extraits juridiques)
        v
    Reponse structuree
```

### Constantes cles

| Constante | Valeur | Role |
|-----------|--------|------|
| `MAX_CONTEXT_DOCS` | 7 | Nombre max de documents dans le contexte |
| `MAX_LEGAL_CHUNKS` | 5 (+3) | Chunks FTS max |
| `MAX_CHUNK_CHARS` | 8000 | Budget total en caracteres pour les extraits |
| Pivots max | 5 | Nombre max d'articles pivot injectes |

---

## 3. Base juridique (`legal_chunks`)

### Structure de la table

| Champ | Type | Role |
|-------|------|------|
| `id` | uuid | Identifiant unique |
| `cda_code` | text | Code CDA Gallilex (ex: "49466", "5108") |
| `article_number` | text | Numero d'article (ex: "1.7.9-4", "32sexies", "1er") |
| `chunk_index` | int | Ordre du chunk dans le texte source |
| `chunk_title` | text | Titre lisible du chunk |
| `content` | text | Texte juridique complet du chunk |
| `citation_display` | text | Reference complete pour citation (ex: "Article 73 de la loi du 29/05/1959") |
| `paragraph` | text | Paragraphe specifique (si applicable) |
| `source_title` | text | Titre du texte source |
| `source_short_title` | text | Titre court |
| `tags` | text[] | Tags thematiques |
| `topics` | text[] | Sujets couverts |
| `education_level` | text | Niveau d'enseignement (commun, secondaire, specialise) |

### Conventions de numerotation

| CDA | Format article | Exemples |
|-----|---------------|----------|
| 49466 (Code enseignement) | `X.Y.Z-N` | `1.7.9-4`, `1.10.2-2`, `6.1.3-2` |
| Lois / Decrets anciens | Numero simple | `6`, `73`, `3` |
| Articles premiers | `1er` | CDA 9547 art. `1er`, CDA 10450 art. `1er` |
| Articles bis/ter/sexies | Suffixe latin | `32sexies`, `39bis`, `13bis` |

### Pieges connus

- **Articles "1er"** : Plusieurs CDA stockent l'article 1 comme `1er` (pas `1`). Toujours verifier le format exact en base.
- **Code de l'enseignement (49466)** : 1043 chunks, numerotation `X.Y.Z-N`. Ne contient PAS d'articles a numerotation simple (les "1", "2", "3" ont ete reindexes en P1).
- **Concordance art. 43 / 73** : Le cours FID cite l'art. 43 §2bis du Pacte scolaire, mais la bonne reference est l'art. 73 §2bis (CDA 5108).
- **Concordance Decret / AR** : Le cours FID parle du "Decret du 29/07/1992", mais c'est l'AR du 29/06/1984 (CDA 10450) qui contient les dispositions sur le NTPP.
- **FTS et articles numeriques** : Le stemmer PostgreSQL francais ignore les tokens numeriques. Une recherche FTS pour "1.7.9-4" ne retrouvera pas l'article. C'est pourquoi le systeme de pivot injection existe.

---

## 4. Pivots FID

### Qu'est-ce qu'un pivot ?

Un article pivot est un article juridique critique pour un cas d'examen FID que la recherche FTS seule ne retrouve pas fiablement. Le systeme les injecte directement dans le contexte LLM via une recherche par `article_number` exact.

### Comment un pivot est defini

Dans `gallilex.ts`, le `PIVOT_ARTICLE_MAP` associe des mots-cles declencheurs a des articles :

```typescript
const PIVOT_ARTICLE_MAP: Record<string, PivotArticle[]> = {
  "exclusion": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Exclusion definitive" },
    { cdaCode: "49466", articleNumber: "1.7.9-5", label: "Ecartement provisoire" },
    { cdaCode: "49466", articleNumber: "1.7.9-6", label: "Procedure d'exclusion" },
  ],
  // ...
};
```

La fonction `findPivotArticles(keywords)` :
1. Compare chaque keyword de la question avec les cles du map (matching bidirectionnel + substring)
2. Collecte les articles correspondants (dedupliques)
3. Retourne au maximum 5 articles pivot

### Ajouter un nouveau pivot

1. Identifier le mot-cle declencheur (ex: `"recours"`)
2. Identifier le CDA et l'article exact (ex: CDA 49466, art. `1.7.9-10`)
3. Verifier que l'article existe en base :
   ```
   GET /rest/v1/legal_chunks?cda_code=eq.49466&article_number=eq.1.7.9-10&select=id&limit=1
   ```
4. Ajouter l'entree dans `PIVOT_ARTICLE_MAP` dans `gallilex.ts`
5. Ajouter le test dans `gallilex-routing.test.ts` (section "Pivot article injection")
6. Ajouter le test de presence dans `legal-chunks-retrieval.test.ts` (section "pivot article presence")
7. Lancer `npm test` pour valider

### Eviter les doublons

- La fonction `findPivotArticles` deduplique par cle `cdaCode:articleNumber`
- Dans la route API, la fusion pivot+FTS deduplique aussi par `cda_code:article_number`
- Un meme article peut apparaitre sous plusieurs cles de declenchement (ex: "exclusion" et "exclusion definitive" menent au meme article) — c'est normal et gere

---

## 5. Tests

### Fichiers de test

| Fichier | Tests | Couverture |
|---------|-------|------------|
| `gallilex-routing.test.ts` | 57 | Registre CDA (19 CDAs), routage theme→CDA (17 cas), pivot detection (17 cas), concordance prompt (2 cas) |
| `legal-chunks-retrieval.test.ts` | 58 | Presence en base (23 articles), coherence contenu (13 patterns), mots-cles (15 checks), integrite DAccE (3), qualite indexation (1) |
| `api-integration.test.ts` | 25 | Pipeline complet (12 cas), qualite prompt (4), pivot effectiveness (7), 5 nouveaux cas |

### Lancer les tests

```bash
# Tous les tests
npm test

# Un fichier specifique
npm test -- gallilex-routing
npm test -- legal-chunks-retrieval
npm test -- api-integration

# Mode watch
npm run test:watch
```

### Ce que les tests couvrent

- **Routage** : les bons CDA sont identifies pour chaque theme FID
- **Pivots** : les bons articles sont detectes pour chaque question-type
- **Presence** : les articles critiques existent en base Supabase (requetes reelles)
- **Coherence** : le contenu des articles commence par le bon numero d'article
- **Mots-cles** : les termes juridiques attendus sont presents dans le contenu
- **Pipeline** : la chaine complete (routing + FTS + pivot + prompt) fonctionne de bout en bout
- **Prompt** : les regles anti-hallucination et concordances sont presentes

### Limites

- Le LLM n'est PAS appele dans les tests — on verifie le contexte envoye, pas la reponse generee
- Les tests de presence et de pipeline font des requetes reelles a Supabase (besoin de connexion)
- Les tests ne couvrent pas l'authentification ni l'ecriture en base (logs, decisions)

---

## 6. Matrice de couverture

### Emplacement

`src/__tests__/fid-coverage-matrix.ts`

### Structure

Chaque cas est un objet `CoverageCase` avec :

| Champ | Type | Signification |
|-------|------|---------------|
| `presence` | boolean | L'article pivot existe dans `legal_chunks` |
| `routing` | boolean | `THEME_CDA_MAP` route vers le bon CDA |
| `retrieval` | boolean | FTS ou pivot injection retrouve l'article |
| `tested` | boolean | Couvert par des tests automatiques |
| `confidence` | `"secured"` / `"partial"` / `"fragile"` | Niveau de confiance global |

### Classification

| Niveau | Criteres |
|--------|----------|
| **Securise** | presence + routing + retrieval + tested — tous OK |
| **Partiel** | Au moins un critere manque (generalement `tested = false`) |
| **Fragile** | Article absent de la base OU retrieval defaillant |

### Mettre a jour la matrice

1. Lancer l'audit Supabase : `python3 scripts/coverage-matrix-audit.py`
2. Consulter `scripts/output/coverage-matrix-audit.json`
3. Mettre a jour les champs dans `fid-coverage-matrix.ts`
4. Utiliser `getCoverageSummary()` pour le decompte global

---

## 7. Procedure d'ajout d'un nouveau cas FID

### Etape 1 — Identifier le cas

Definir :
- Le theme FID (ex: "Conge de maladie")
- La question-type d'examen
- Le CDA concerne (ex: 25174)
- L'article pivot (ex: art. 3)

### Etape 2 — Verifier la presence en base

```bash
# Via curl ou script Python
GET /rest/v1/legal_chunks?cda_code=eq.25174&article_number=eq.3&select=id,content&limit=1
```

Si l'article n'existe pas :
- Recuperer le texte depuis Gallilex (PDF)
- L'inserer dans `legal_chunks` avec les bons champs (cda_code, article_number, chunk_title, content, citation_display)
- Verifier le format exact de `article_number` (attention aux "1er", "bis", format X.Y.Z-N)

### Etape 3 — Verifier le routage

Dans `gallilex.ts`, verifier que `THEME_CDA_MAP` contient une entree qui mene au bon CDA pour les mots-cles de la question. Ajouter si necessaire.

### Etape 4 — Ajouter le pivot (si FTS insuffisant)

Dans `PIVOT_ARTICLE_MAP`, ajouter :
```typescript
"conge maladie": [
  { cdaCode: "25174", articleNumber: "3", label: "Conge de maladie" },
],
```

Tester avec `findPivotArticles(["conge", "maladie"])` que l'article est detecte.

### Etape 5 — Ajouter les tests

1. **gallilex-routing.test.ts** :
   - Ajouter un cas dans `cdaRoutingCases` (routage)
   - Ajouter un cas dans `pivotCases` (pivot detection)

2. **legal-chunks-retrieval.test.ts** :
   - Ajouter dans `pivotArticleCases` (presence)
   - Ajouter dans `coherenceCases` si pertinent (pattern)
   - Ajouter dans `keywordCases` si mots-cles specifiques

3. **api-integration.test.ts** :
   - Ajouter un test pipeline complet avec la question-type

4. Lancer `npm test` — les 3 fichiers doivent passer.

### Etape 6 — Mettre a jour la matrice

Ajouter le cas dans `fid-coverage-matrix.ts` avec tous les champs. Lancer `scripts/coverage-matrix-audit.py` pour confirmer.

### Checklist rapide

```
[ ] Article present dans legal_chunks (bon cda_code + article_number)
[ ] THEME_CDA_MAP route vers le bon CDA
[ ] PIVOT_ARTICLE_MAP injecte l'article si FTS ne suffit pas
[ ] Test routage dans gallilex-routing.test.ts
[ ] Test presence dans legal-chunks-retrieval.test.ts
[ ] Test pipeline dans api-integration.test.ts
[ ] Entree dans fid-coverage-matrix.ts
[ ] npm test → 0 echecs
```
