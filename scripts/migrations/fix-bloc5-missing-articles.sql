-- ============================================================
-- Migration : Bloc 5 — Corrections d'indexation
-- Date      : 2026-04-03
-- Bloque    : 4 articles manquants / 1 fix d'indexation
-- ============================================================

-- ============================================================
-- 1. FIX : 47114:Annexe — affecter article_number aux 3 chunks existants
--    Les 3 chunks existent deja avec article_number IS NULL.
--    IDs verifies le 2026-04-03.
-- ============================================================

UPDATE legal_chunks
SET article_number = 'Annexe'
WHERE cda_code = '47114'
  AND article_number IS NULL
  AND id IN (
    '51124045-a905-42b7-937e-6a4f2c423229',
    '33b7702f-2274-4e61-949d-f3970f2055a3',
    'f83894d6-6566-4738-a74a-87f7c48932c5'
  );

-- Verification :
-- SELECT id, article_number, chunk_title FROM legal_chunks
-- WHERE cda_code = '47114' AND article_number = 'Annexe';
-- Attendu : 3 lignes

-- ============================================================
-- 2. INSERT : 45031:32nonies — Harcelement moral (procedure interne)
--    Source : Loi du 4 aout 1996 relative au bien-etre des travailleurs,
--             art. 32nonies (insere par L. 11-06-2002, modifie par L. 28-02-2014)
-- ============================================================

INSERT INTO legal_chunks (cda_code, article_number, chunk_index, chunk_title, content, source_title, source_short_title, citation_display)
VALUES (
  '45031',
  '32nonies',
  0,
  'Art. 32nonies — Procedure interne harcelement',
  -- CONTENU A COMPLETER : coller le texte integral de l''article 32nonies
  -- de la Loi du 4 aout 1996 (bien-etre des travailleurs).
  -- Le texte doit couvrir :
  --   - demande d''intervention psychosociale formelle pour faits de harcelement
  --   - role du conseiller en prevention / personne de confiance
  --   - procedure de traitement de la demande
  --   - mesures conservatoires eventuelles
  'TODO: COLLER LE TEXTE INTEGRAL DE L''ARTICLE 32nonies ICI',
  'Loi du 4 aout 1996 relative au bien-etre des travailleurs lors de l''execution de leur travail',
  'L. 04-08-1996 bien-etre',
  'L. 04-08-1996, art. 32nonies'
);

-- ============================================================
-- 3. INSERT : 47237:4/1 — Aptitude pedagogique via inspection
--    Source : Decret du 13 septembre 2018 portant diverses dispositions
--             en matiere d'enseignement (CDA 47237)
--             Art. 4/1 (insere par D. posterieur)
-- ============================================================

INSERT INTO legal_chunks (cda_code, article_number, chunk_index, chunk_title, content, source_title, source_short_title, citation_display)
VALUES (
  '47237',
  '4/1',
  0,
  'Art. 4/1 — Constatation de manquement par l''inspection',
  -- CONTENU A COMPLETER : coller le texte integral de l''article 4/1
  -- du Decret du 13 septembre 2018 (CDA 47237).
  -- Le texte doit couvrir :
  --   - constatation de manquement a l''aptitude pedagogique
  --   - role du service d''inspection
  --   - consequences sur le membre du personnel
  --   - lien avec l''article 4 (mission generale d''inspection)
  'TODO: COLLER LE TEXTE INTEGRAL DE L''ARTICLE 4/1 ICI',
  'Decret du 13 septembre 2018 portant diverses dispositions en matiere d''enseignement',
  'D. 13-09-2018',
  'D. 13-09-2018, art. 4/1'
);

-- ============================================================
-- 4. INSERT : Decret du 11 avril 2024 — Titres et brevets
--    Ce decret n'a PAS de CDA existant dans le corpus.
--    Il faut d'abord creer l'entree dans le registre CDA
--    (si le registre est gere en base), puis indexer les articles.
--
--    CDA suggere : a definir (numero Gallilex du texte)
--    Articles cles a indexer en priorite :
--      - Article definissant les titres requis / titres suffisants
--      - Article sur les brevets de capacite
--      - Article sur les derogations / fonctions en penurie
--
--    ACTION MANUELLE REQUISE :
--      1. Identifier le numero CDA Gallilex du Decret 11/04/2024
--      2. Ajouter l'entree dans CDA_REGISTRY (gallilex.ts)
--      3. Ajouter le mapping dans THEME_CDA_MAP (gallilex.ts)
--      4. Indexer les articles cles dans legal_chunks
-- ============================================================

-- Template INSERT (a completer une fois le CDA identifie) :
--
-- INSERT INTO legal_chunks (cda_code, article_number, chunk_index, chunk_title, content, source_title, source_short_title, citation_display)
-- VALUES (
--   'XXXXX',  -- CDA Gallilex du Decret 11/04/2024
--   '1er',
--   0,
--   'Art. 1er — Objet',
--   'TODO: texte',
--   'Decret du 11 avril 2024 relatif aux titres et brevets requis pour les fonctions dans l''enseignement',
--   'D. 11-04-2024 titres/brevets',
--   'D. 11-04-2024, art. 1er'
-- );
