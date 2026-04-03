@AGENTS.md

# FID Copilot — Guide pour Claude Code

## 1. Contexte produit

FID Copilot est un assistant juridique SaaS pour les directions d'ecole de la Federation Wallonie-Bruxelles (Belgique). Il sert a preparer l'examen FID (Formation Initiale des Directeurs) et a securiser les decisions quotidiennes des directeurs.

Ce n'est PAS un chatbot generique. Chaque reponse doit :
- citer des articles de loi exacts (Code de l'enseignement, Decret Missions, Pacte, etc.) ;
- etre structuree en sections (Probleme, Droit, Application, Conclusion, Posture) ;
- indiquer un niveau de confiance base sur les sources trouvees ;
- signaler les citations non verifiees via le Citation Guard.

Le corpus juridique provient de Gallilex (textes officiels FWB) et est stocke dans Supabase (`legal_chunks`).

## 2. Principes a respecter IMPERATIVEMENT

- **Ne jamais introduire de citation juridique non verifiee** — toute reference a un article doit etre presente dans `legal_chunks` ou etre flaggee par le Citation Guard.
- **Ne jamais casser les 15 cas FID critiques** — ces cas sont securises par des tests de non-regression. Toujours lancer `npx vitest run` avant de valider.
- **Ne jamais modifier le routage CDA ou les pivots sans ajouter/adapter les tests** dans `gallilex-routing.test.ts`.
- **Ne jamais ajouter de logique non testee** dans le pipeline (routage, retrieval, citation guard).
- **Preserver la lisibilite des reponses juridiques** — le format structure est critique pour les utilisateurs.
- **Ne pas lancer de gros chantier non demande** — proposer des lots petits et coherents, attendre la validation.

## 3. Architecture critique

### Pipeline de reponse (route `/api/assistant` et `/api/decision`)

```
Question utilisateur
  |
  v
Extraction de mots-cles
  |
  v
Routage CDA (THEME_CDA_MAP dans gallilex.ts)
  → Determine quels textes legaux interroger
  |
  v
Injection de pivots (PIVOT_ARTICLE_MAP dans gallilex.ts)
  → Articles cles injectes avant le FTS
  |
  v
Full-Text Search (Supabase, config: "french")
  → Recherche dans legal_chunks
  |
  v
LLM (Gemini 2.5 Flash, fallback GPT-4o-mini)
  → Genere la reponse structuree
  |
  v
Citation Guard (citation-guard.ts)
  → Valide les references d'articles dans la reponse
  → Flagge les citations non verifiees [ref. non verifiee]
  |
  v
Logging enrichi (metadata JSONB sur assistant_logs)
  → Audit trail : model, CDA, articles, latence, citation guard
  |
  v
Reponse JSON
  → answer, sources, confidence, gallilex, logId, legalRefs, citationGuard
```

### Fichiers critiques

| Fichier | Role | Quand le modifier |
|---------|------|-------------------|
| `src/lib/ai/gallilex.ts` | Routage CDA + injection pivots | Ajout de themes ou d'articles cles |
| `src/lib/ai/citation-guard.ts` | Validation post-LLM des citations | Ajustement du regex ou de la logique de matching |
| `src/lib/ai/gemini.ts` | Appel LLM (Gemini + fallback OpenAI) | Changement de modele ou de parametres |
| `src/app/api/assistant/route.ts` | Pipeline principal assistant | Modification du flux de donnees |
| `src/app/api/decision/route.ts` | Pipeline aide a la decision | Idem assistant, meme pattern |
| `src/app/api/history/[id]/route.ts` | PATCH feedback (rating) | Extension du schema de feedback |
| `src/components/assistant/assistant-chat.tsx` | UI principale assistant | Ajout de fonctionnalites UI |
| `src/components/assistant/legal-references.tsx` | Badges base juridique | Modification affichage references |
| `legal_chunks` (Supabase) | Corpus juridique complet | Ajout ou correction d'articles |

### Donnees cles

- **`legal_chunks`** : table Supabase avec `cda_code`, `article_number`, `content`, `title`, `category`. FTS via `content` avec config `french`.
- **`THEME_CDA_MAP`** : mapping mots-cles → codes CDA (dans `gallilex.ts`). Determine quels textes legaux sont interroges.
- **`PIVOT_ARTICLE_MAP`** : mapping mots-cles → numeros d'articles. Ces articles sont injectes dans le contexte AVANT le FTS pour garantir leur presence.
- **Articles "1er"** : dans la legislation belge, le premier article s'ecrit `1er`, pas `1`. Le regex et la base doivent respecter cette convention.
- **Suffixes latins** : `bis`, `ter`, `quater`, `quinquies`, `sexies`, etc. Le regex du Citation Guard les gere.

## 4. Workflow de correction

Quand un bug ou feedback negatif est identifie :

```
1. IDENTIFIER le type d'erreur
   → Consulter docs/feedback-loop.md pour la classification
   → Categories : MISSING_ARTICLE, BAD_INDEX, BAD_ROUTING,
     MISSING_PIVOT, BAD_CITATION, VAGUE_RESPONSE, STALE_REF, OTHER

2. CORRIGER au bon endroit
   → Article manquant    → legal_chunks (Supabase)
   → Routage incorrect   → THEME_CDA_MAP dans gallilex.ts
   → Pivot manquant      → PIVOT_ARTICLE_MAP dans gallilex.ts
   → Citation hallucinee → citation-guard.ts ou prompt
   → Reponse vague       → prompt systeme

3. TESTER
   → npx vitest run (169+ tests doivent passer)
   → Ajouter un test specifique au cas corrige

4. METTRE A JOUR la matrice si nouveau cas critique
   → src/__tests__/fid-coverage-matrix.ts

5. ENREGISTRER le cas dans scripts/feedback-cases.json
```

Toujours distinguer les 4 couches du probleme :
- **Presence** : l'article existe-t-il dans `legal_chunks` ?
- **Routage** : le bon CDA est-il selectionne par `THEME_CDA_MAP` ?
- **Retrieval** : l'article est-il remonte par FTS ou pivot ?
- **Generation** : le LLM utilise-t-il correctement les articles dans sa reponse ?

## 5. Commandes utiles

```bash
# PATH requis (npm n'est pas dans le PATH par defaut)
export PATH="/usr/local/bin:$PATH"

# Tests (169+ tests, 4 fichiers)
npx vitest run

# TypeScript check
npx tsc --noEmit

# Build production
npm run build

# Dev server
npm run dev

# Analyse des feedbacks negatifs (necessite SUPABASE_SERVICE_KEY)
./scripts/analyze-feedback.sh           # derniers 50
./scripts/analyze-feedback.sh 20        # derniers 20
./scripts/analyze-feedback.sh 100 2025-03-01  # depuis une date
```

## 6. Fichiers de reference

| Document | Chemin | Contenu |
|----------|--------|---------|
| Architecture | `docs/architecture.md` | Schema complet du pipeline, technologies, flux de donnees |
| Feedback loop | `docs/feedback-loop.md` | Procedure de correction, classification des erreurs, mapping erreur→action |
| Matrice de couverture | `src/__tests__/fid-coverage-matrix.ts` | 15 cas FID critiques avec statut (presence, routing, retrieval, tested) |
| Tests routage + pivots | `src/__tests__/gallilex-routing.test.ts` | Tests des CDA et pivots pour les 15 cas |
| Tests retrieval | `src/__tests__/legal-chunks-retrieval.test.ts` | Tests de presence et coherence des articles en base |
| Tests citation guard | `src/__tests__/citation-guard.test.ts` | 29 tests : extraction, verification, hallucination, sanitization |
| Tests pipeline E2E | `src/__tests__/api-integration.test.ts` | Tests d'integration du pipeline complet |
| Cas de feedback | `scripts/feedback-cases.json` | Registre des feedbacks negatifs analyses |
| Migration rating | `scripts/migrations/add-rating-column.sql` | Colonne rating sur assistant_logs |
| Migration metadata | `scripts/migrations/add-metadata-column.sql` | Colonne metadata JSONB sur assistant_logs |

## 7. Style de travail attendu

- **Lots petits et coherents** : une fonctionnalite ou correction a la fois, pas de refonte massive.
- **Proposer avant d'implementer** quand le scope est large ou ambigu.
- **Rapport de livraison** : chaque lot livre doit inclure : fichiers modifies, migration SQL si applicable, resume du flux de donnees, preuves (tests, build).
- **Toujours lancer les tests** (`npx vitest run`) et le build (`npm run build`) avant de livrer.
- **Ne pas supposer le comportement de Supabase** : si une colonne ou table n'existe pas, demander confirmation ou fournir le SQL de migration exact.
- **Version** : mettre a jour `src/lib/version.ts` quand une version est taguee.
- **Pas d'emojis dans le code** sauf si demande explicitement.
- **Supabase** : URL `https://lxkmufsfehpkudpxkzxr.supabase.co`, anon key publique `sb_publishable_9iToG5wloKgjpEWD2-8Plw_E72IoRLW`. Auth par cookies (SSR).
