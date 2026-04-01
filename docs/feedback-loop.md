# Boucle de correction des feedbacks negatifs

Procedure operationnelle pour transformer un feedback 👎 en correctif concret.

## 1. Recuperer le feedback

```bash
# Option A — Script terminal (necessite SUPABASE_SERVICE_KEY)
./scripts/analyze-feedback.sh 10

# Option B — Route API (necessite session auth)
curl http://localhost:3000/api/feedback/analysis?limit=10
```

Chaque entree contient : `question`, `response`, `metadata` (cdaRouted, pivotArticles, articlesSentToLlm, model, confidence, citationGuard).

## 2. Analyser un cas

Pour chaque 👎, lire dans l'ordre :

1. **La question** — quel sujet FID est concerne ?
2. **cdaRouted** — le bon CDA a-t-il ete selectionne ?
3. **pivotArticles** — les bons pivots ont-ils ete injectes ?
4. **articlesSentToLlm** — les articles pertinents etaient-ils dans le contexte ?
5. **citationGuard** — des articles non verifies ont-ils ete cites ?
6. **La reponse** — est-elle juridiquement correcte ? Precise ? Complete ?

## 3. Classifier l'erreur

Chaque 👎 tombe dans **une seule** categorie principale :

| Code | Categorie | Comment la reconnaitre | Symptome typique |
|------|-----------|----------------------|------------------|
| `MISSING_ARTICLE` | Article manquant en base | L'article cite ou attendu n'est pas dans `articlesSentToLlm` ET n'existe pas dans `legal_chunks` | Reponse vague, cite un article sans pouvoir le detailler |
| `BAD_INDEX` | Article mal indexe | L'article existe dans `legal_chunks` mais le FTS ne le remonte pas (mauvais keywords dans le contenu) | Article present en base mais absent de `articlesSentToLlm` |
| `BAD_ROUTING` | Mauvais routage CDA | `cdaRouted` ne contient pas le bon CDA pour la thematique | Reponse basee sur le mauvais texte legal |
| `MISSING_PIVOT` | Pivot manquant | Le sujet est connu mais aucun pivot n'est injecte, FTS seul ne suffit pas | `pivotArticles` vide alors qu'un article cle existe |
| `BAD_CITATION` | Citation non fiable | `citationGuard.unverified` contient des articles inventes par le LLM | Reponse cite des articles qui n'existent pas |
| `VAGUE_RESPONSE` | Reponse juridiquement vague | Les bons articles sont dans le contexte mais la reponse reste generique | Pas de reference precise, formulations evasives |
| `STALE_REF` | Reference FID ancienne/erronee | L'article cite a ete abroge, modifie, ou le numero a change | Citation d'un article qui n'existe plus sous cette forme |
| `OTHER` | Autre | Aucune des categories ci-dessus | Probleme de formatage, timeout, erreur technique |

## 4. Mapping erreur → action

| Code | Ou corriger | Action typique | Verification |
|------|-------------|---------------|-------------|
| `MISSING_ARTICLE` | `legal_chunks` (Supabase) | Extraire l'article depuis Gallilex PDF, inserer dans `legal_chunks` avec bon `cda_code`, `article_number`, `content` | `SELECT * FROM legal_chunks WHERE article_number = 'X' AND cda_code = 'Y'` |
| `BAD_INDEX` | `legal_chunks.content` (Supabase) | Verifier/corriger le contenu textuel, s'assurer que les mots-cles discriminants sont presents | Tester avec `.textSearch("content", "mot_cle", { config: "french" })` |
| `BAD_ROUTING` | `src/lib/ai/gallilex.ts` → `THEME_CDA_MAP` | Ajouter l'entree keyword → CDA code | Test dans `gallilex-routing.test.ts` |
| `MISSING_PIVOT` | `src/lib/ai/gallilex.ts` → `PIVOT_ARTICLE_MAP` | Ajouter l'entree keyword → article_number(s) | Test dans `gallilex-routing.test.ts` (section pivots) |
| `BAD_CITATION` | `src/lib/ai/citation-guard.ts` | Si faux positif : ajuster le regex. Si vraie hallucination : renforcer le prompt systeme | Test dans `citation-guard.test.ts` |
| `VAGUE_RESPONSE` | `src/lib/ai/prompts.ts` ou prompt systeme | Renforcer les instructions de precision juridique, exiger les numeros d'articles | Test qualitatif via `api-integration.test.ts` |
| `STALE_REF` | `legal_chunks` + prompt | Mettre a jour l'article en base, ajouter une note de concordance dans le prompt si renumerotation | Verifier sur Gallilex que la version est la bonne |
| `OTHER` | Variable | Diagnostiquer au cas par cas | — |

## 5. Fichiers impliques (reference rapide)

| Fichier | Role | Quand le modifier |
|---------|------|-------------------|
| `legal_chunks` (Supabase) | Corpus juridique | MISSING_ARTICLE, BAD_INDEX, STALE_REF |
| `src/lib/ai/gallilex.ts` | Routage CDA + pivots | BAD_ROUTING, MISSING_PIVOT |
| `src/lib/ai/citation-guard.ts` | Validation post-LLM | BAD_CITATION |
| `src/lib/ai/prompts.ts` | Prompt systeme | VAGUE_RESPONSE, STALE_REF |
| `src/__tests__/gallilex-routing.test.ts` | Tests routage + pivots | BAD_ROUTING, MISSING_PIVOT |
| `src/__tests__/legal-chunks-retrieval.test.ts` | Tests presence + FTS | MISSING_ARTICLE, BAD_INDEX |
| `src/__tests__/citation-guard.test.ts` | Tests citation guard | BAD_CITATION |
| `src/__tests__/api-integration.test.ts` | Tests pipeline E2E | Tous les cas critiques |
| `src/__tests__/fid-coverage-matrix.ts` | Matrice 15 cas FID | Si nouveau cas critique decouvert |

## 6. Procedure complete (checklist)

```
□ 1. Lancer ./scripts/analyze-feedback.sh
□ 2. Choisir un 👎 a traiter
□ 3. Lire question + reponse + metadata
□ 4. Classifier (une seule categorie)
□ 5. Enregistrer dans scripts/feedback-cases.json (template ci-dessous)
□ 6. Appliquer le correctif (voir tableau §4)
□ 7. Ajouter ou mettre a jour le test de non-regression
□ 8. npx vitest run — tous les tests passent
□ 9. Si nouveau cas FID critique : mettre a jour fid-coverage-matrix.ts
□ 10. Mettre a jour le statut dans feedback-cases.json → "fixed"
□ 11. Commit + push
```

## 7. Quand mettre a jour la matrice de couverture

La matrice (`fid-coverage-matrix.ts`) ne couvre que les **15 cas FID critiques** identifies. La mettre a jour si :

- Un feedback revele un **nouveau cas FID recurrent** qui merite un suivi permanent
- Un cas existant passe de `secured` a `fragile` (regression)

Ne pas ajouter chaque feedback individuel a la matrice — c'est `feedback-cases.json` qui joue ce role.
