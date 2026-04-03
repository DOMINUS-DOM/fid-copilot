# Vision produit — FID Copilot

Document fondateur mis a jour par rapport a l'etat reel du projet (v3.5).

## 1. Probleme

Les directeurs d'ecole de la Federation Wallonie-Bruxelles utilisent Gallilex pour chercher des articles de loi, des alineas et des bases legales. Cette recherche est lente, complexe et sujette a erreur.

## 2. Solution

Un assistant juridique intelligent qui, a partir d'une question en langage naturel, fournit :
- une reponse claire et structuree
- les articles de loi pertinents avec numeros exacts
- un lien vers la source officielle (Gallilex)
- un niveau de confiance
- un avertissement si une reference n'a pas pu etre verifiee

## 3. Utilisateurs cibles

- Directeurs d'ecole (primaire / secondaire)
- Candidats a l'examen FID (Formation Initiale des Directeurs)
- Pouvoirs organisateurs
- Personnel administratif

Niveau technique : faible a moyen. Attente : rapidite, simplicite, fiabilite.

---

## 4. Fonctionnalites — etat actuel

### Fait et en production

| Fonctionnalite | Statut | Detail |
|---|---|---|
| Recherche en langage naturel | ✅ | FTS PostgreSQL (french) + routage CDA + injection pivots |
| Reponse structuree (5 sections) | ✅ | Probleme, Droit, Application, Conclusion, Posture |
| Sources legales avec articles exacts | ✅ | Badges cliquables Art. X / CDA Y → lien Gallilex |
| Niveau de confiance | ✅ | High / Medium / Low + nombre de sources |
| Avertissement juridique | ✅ | Citation Guard post-LLM + banniere UI |
| Historique utilisateur | ✅ | Table assistant_logs + page historique |
| Feedback utilisateur | ✅ | Thumbs up/down + analyse des feedbacks negatifs |
| 3 modes de reponse | ✅ | Examen (FID), Terrain (directeur en poste), Portfolio |
| Aide a la decision | ✅ | Route dediee avec categorie + urgence |
| Generateur de documents | ✅ | Courriers, convocations, reponses formelles |
| Verification de conformite | ✅ | Controle juridique de documents existants |
| Contexte ecole | ✅ | Upload ROI et documents internes, pris en compte dans les reponses |
| Anti-hallucination | ✅ | Citation Guard (regex post-LLM) + regles prompt strictes |
| Audit trail | ✅ | Metadata JSONB : modele, CDA, articles, latence, citation guard |
| Pipeline partage | ✅ | shared-pipeline.ts unifie assistant et decision |
| Tests non-regression | ✅ | 169 tests, 15 cas FID critiques securises |
| Documentation | ✅ | architecture.md, feedback-loop.md, CLAUDE.md |

### Prevu dans le document initial, depasse par un meilleur choix

| Prevu | Choix actuel | Justification |
|---|---|---|
| Embeddings vectoriels (Pinecone/pgvector) | FTS PostgreSQL + pivots | Les pivots garantissent la presence des articles critiques. Le FTS couvre le reste. Plus simple, plus deterministe, plus auditable. |
| Backend Python (FastAPI) | Next.js API routes (TypeScript) | Un seul langage, un seul deploiement (Vercel), maintenance simplifiee. |
| Scraping Gallilex | Extraction PDF + insertion manuelle | Plus fiable, controle total sur le corpus, pas de dependance a un scraper fragile. |

### Prevu et pas encore fait (pertinent)

| Fonctionnalite | Pertinence | Effort estime |
|---|---|---|
| Surlignage des passages pertinents dans la reponse | Moyenne — ameliore la lisibilite | 3-4h |
| Favoris (sauvegarder des reponses) | Moyenne — utile pour les directeurs en poste | 2-3h |
| Cas similaires / suggestions automatiques | Haute — exploiter l'historique pour proposer des cas proches | 5-8h |

### Prevu et plus pertinent

| Fonctionnalite | Raison |
|---|---|
| Export CSV de Gallilex | Pas de CSV disponible, extraction PDF est la methode utilisee |
| Recherche semantique pure | Le FTS + pivots est plus fiable pour le juridique belge |

---

## 5. Principe de fiabilite

**Une reponse n'est valable que si elle est tracable a une base juridique explicitement injectee.**

Ce principe est le fondement de FID Copilot. Il signifie concretement :

- Le LLM ne peut citer un article que si cet article a ete injecte dans son contexte via le pipeline (FTS ou pivot).
- Toute reference a un article non present dans le contexte est detectee par le Citation Guard et flaggee comme `[ref. non verifiee]`.
- Une reponse sans source juridique identifiable n'est pas une reponse fiable — elle doit etre signalee comme telle a l'utilisateur (confiance "low", Gallilex fallback).
- Le systeme ne cherche jamais a paraitre plus sur qu'il ne l'est. Si l'article n'est pas en base, il ne doit pas etre invente. Si le routage ne trouve pas de CDA pertinent, la reponse doit l'indiquer.

Ce principe guide toutes les decisions techniques : le choix du FTS + pivots plutot que des embeddings purs, l'existence du Citation Guard, le calcul de confiance, et la boucle de feedback.

---

## 6. Contraintes non negociables

Ces regles sont permanentes et ne changent pas avec les versions :

1. **Toujours afficher la source** — chaque affirmation juridique doit etre tracable a un article.
2. **Ne jamais inventer une loi** — si l'article n'est pas dans le contexte, le dire explicitement.
3. **Distinguer texte legal et interpretation** — la reponse structuree separe le droit (section 2) de l'application (section 3).
4. **Signaler les references non verifiees** — le Citation Guard flagge toute citation que le pipeline n'a pas pu confirmer.
5. **Reponse < 5 secondes** — objectif UX. Actuellement ~2-4s selon le provider LLM.
6. **Logs systematiques** — chaque requete est loggee avec metadata complete pour audit et amelioration.

---

## 7. Architecture technique (resume)

```
Frontend (Next.js 15, Tailwind, Lucide)
  |
  v
API Routes (/api/assistant, /api/decision, /api/generate, /api/verify)
  |
  v
Pipeline partage (shared-pipeline.ts)
  ├── extractKeywords
  ├── fetchLegalChunks (FTS + pivots)
  ├── fetchSchoolChunks
  ├── runCitationGuard
  └── buildPipelineMetadata
  |
  v
LLM (Gemini 2.5 Flash → GPT-4o-mini fallback)
  |
  v
Supabase (PostgreSQL)
  ├── legal_chunks (2600+ articles, 31 CDA)
  ├── documents (fiches de reference)
  ├── school_documents / school_chunks (contexte ecole)
  ├── assistant_logs (historique + metadata + rating)
  └── decisions (aide a la decision)
```

Detail complet : `docs/architecture.md`

---

## 8. Metriques produit

| Metrique | Valeur actuelle |
|---|---|
| Articles juridiques en base | 2600+ |
| Codes CDA couverts | 31 |
| Themes routes | 142 |
| Articles pivots | 59 |
| Cas FID critiques securises | 15/15 |
| Tests automatises | 169 |
| Providers LLM | 2 (Gemini + OpenAI fallback) |

---

## 9. Roadmap (3 horizons)

### Court terme (1-2 semaines)
- Script de validation pivots vs base (detecter les pivots orphelins)
- Unifier l'anti-hallucination dans le prompt assistant
- 15 tests FID pour la route decision
- Test CI de coherence pivots ↔ base

### Moyen terme (1-2 mois)
- Script d'auto-diagnostic des feedbacks negatifs
- Agregation de patterns (top articles/CDA dans les feedbacks negatifs)
- Enrichir le corpus (5-10 CDA supplementaires)
- Decouper assistant-chat.tsx en composants

### Long terme (3-6 mois)
- Rapport hebdomadaire auto-genere (boucle autoevolutive)
- Scoring de confiance par CDA (historique des feedbacks par theme)
- Multi-tenant (contextes ecole isoles par etablissement)

Detail complet : audit dans la session v3.5.

---

## 10. Reference

| Document | Chemin |
|---|---|
| Architecture technique | `docs/architecture.md` |
| Boucle de feedback | `docs/feedback-loop.md` |
| Guide Claude Code | `CLAUDE.md` |
| Matrice de couverture | `src/__tests__/fid-coverage-matrix.ts` |
