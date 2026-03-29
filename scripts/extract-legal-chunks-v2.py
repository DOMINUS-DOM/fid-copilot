#!/usr/bin/env python3
"""
Extraction V2 — chunks structurés avec article_number + paragraph + citation_display.

Usage:
  python3 scripts/extract-legal-chunks-v2.py

Produit:
  scripts/output/legal_chunks_v2_phase1.sql
  scripts/output/legal_chunks_v2_phase2.sql
"""

import fitz
import os
import re

# ============================================================
# Configuration
# ============================================================

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "legal-pdfs", "Textes légaux")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

PHASE_1_DIRS = [
    "1- documents communs - les incontournables",
    "2- Secondaire ordinaire et spécialisé - les incontournables",
    "3- ESAHR - incontournables",
]

PHASE_2_DIRS = [
    "4 - communs facultatifs",
    "5- secondaire ordinaire et spécialisé - facultatifs",
    "6- ESAHR - Facultatifs",
    "Pour info",
]

MIN_CHUNK_SIZE = 150
MAX_CHUNK_SIZE = 4000

# Mapping CDA → (titre officiel, titre court, niveau)
CDA_META = {
    "5108":  ("Loi du 29 mai 1959 — Pacte scolaire", "Pacte scolaire", "commun"),
    "31886": ("Décret du 2 février 2007 fixant le statut des directeurs", "Statut des directeurs", "commun"),
    "10450": ("Arrêté Royal du 29 juin 1984 — Organisation de l'enseignement secondaire", "AR 29 juin 1984", "secondaire"),
    "16421": ("Décret du 3 juillet 1991 — Enseignement en alternance", "Décret alternance", "secondaire"),
    "17144": ("Décret du 29 juillet 1992 — Organisation de l'enseignement secondaire de plein exercice", "Décret 29 juillet 1992", "secondaire"),
    "21557": ("Décret du 24 juillet 1997 — Missions prioritaires (Décret Missions)", "Décret Missions", "commun"),
    "28737": ("Décret du 3 mars 2004 — Enseignement spécialisé", "Décret spécialisé", "specialise"),
    "40701": ("Décret du 11 avril 2014 — Titres et fonctions", "Décret titres et fonctions", "commun"),
    "46287": ("Décret du 14 mars 2019 — Organisation du travail du personnel", "Décret organisation travail", "commun"),
    "47165": ("Décret du 3 mai 2019 — Code de l'enseignement (tronc commun)", "Code enseignement (TC)", "commun"),
    "49466": ("Code de l'enseignement fondamental et de l'enseignement secondaire", "Code de l'enseignement", "commun"),
    "51784": ("Décret du 2 juin 1998 — Organisation de l'ESAHR", "Décret ESAHR", "esahr"),
    "4329":  ("Loi du 30 juillet 1963 — Régime linguistique", "Loi régime linguistique", "commun"),
    "5556":  ("Arrêté royal du 15 avril 1958 — Statut pécuniaire du personnel enseignant", "AR statut pécuniaire", "commun"),
    "25174": ("Décret du 5 juillet 2000 — Régime des congés", "Décret congés", "commun"),
    "27861": ("Décret du 17 juillet 2003 — Intervention transport en commun", "Décret transport", "commun"),
    "46239": ("Décret du 10 janvier 2019 — Service général de l'inspection", "Décret inspection", "commun"),
    "9547":  ("Loi du 29 juin 1983 — Obligation scolaire", "Loi obligation scolaire", "commun"),
    "30998": ("Décret du 30 juin 2006 — Premier degré du secondaire", "Décret 1er degré", "secondaire"),
    "31723": ("Décret du 12 janvier 2007 — Citoyenneté à l'école", "Décret citoyenneté", "commun"),
    "32365": ("Décret du 11 mai 2007 — Immersion linguistique", "Décret immersion", "secondaire"),
    "34295": ("Décret du 30 avril 2009 — Encadrement différencié", "Décret encadrement différencié", "secondaire"),
    "45031": ("Décret du 18 janvier 2018 — Code de prévention et aide à la jeunesse", "Code prévention jeunesse", "commun"),
    "45593": ("Décret du 13 septembre 2018 — Service général de pilotage des écoles et CPMS", "Décret pilotage", "commun"),
    "45721": ("AGCF du 6 novembre 2018 — Répertoire des options de base", "AGCF options de base", "secondaire"),
    "46275": ("Décret du 7 février 2019 — Accueil des élèves allophones (DASPA/FLA)", "Décret DASPA/FLA", "commun"),
    "47237": ("Décret du 28 mars 2019 — Cellule de soutien et d'accompagnement", "Décret CSA", "commun"),
    "47114": ("AGCF du 3 juillet 2019 — Profil de la fonction d'éducateur", "AGCF éducateur", "secondaire"),
    "23189": ("Décret du 15 mars 1999 — Formation en cours de carrière ESAHR", "Décret formation ESAHR", "esahr"),
    "51683": ("Décret relatif au soutien et à l'évaluation des personnels", "Décret évaluation personnels", "commun"),
}

# Compat: keep CDA_TITLES for existing code
CDA_TITLES = {k: v[0] for k, v in CDA_META.items()}

# Topic detection keywords
TOPIC_KEYWORDS = {
    "recours": ["recours", "conciliation", "conseil de recours", "contestation"],
    "inscription": ["inscription", "admis", "admission", "refus d'inscription"],
    "exclusion": ["exclusion", "renvoi", "définitif", "temporaire"],
    "discipline": ["disciplin", "sanction", "puniti", "mesure d'ordre"],
    "redoublement": ["redoublement", "maintien", "année complémentaire", "attestation B", "attestation C"],
    "orientation": ["orientation", "forme d'enseignement", "option", "filière"],
    "évaluation": ["évaluation", "conseil de classe", "délibération", "CE1D", "CESS"],
    "personnel": ["nomination", "désignation", "barème", "ancienneté", "temporaire", "définitif"],
    "inspection": ["inspection", "audit", "contrôle", "pilotage"],
    "obligation scolaire": ["obligation scolaire", "fréquentation", "absence", "absentéisme"],
    "parents": ["parents", "responsable légal", "information", "communication"],
    "ROI": ["règlement d'ordre intérieur", "R.O.I", "ROI"],
    "spécialisé": ["spécialisé", "intégration", "aménagement raisonnable", "pôle territorial"],
    "DASPA": ["DASPA", "primo-arrivant", "allophone", "FLA"],
    "pilotage": ["plan de pilotage", "contrat d'objectifs", "DCO"],
    "surveillance": ["surveillance", "responsabilité", "faute", "dommage"],
}


def detect_topics(content: str) -> list:
    """Détecte les thèmes présents dans un chunk."""
    lower = content.lower()
    found = []
    for topic, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in lower:
                found.append(topic)
                break
    return found[:5]  # Max 5 topics per chunk


# ============================================================
# Extraction + nettoyage
# ============================================================

def extract_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def clean_text(text: str) -> str:
    text = re.sub(r"Centre de documentation administrative\s*\n", "", text)
    text = re.sub(r"Secrétariat général\s*\n", "", text)
    text = re.sub(r"Mise à jour au \d{2}-\d{2}-\d{4}\s*\n", "", text)
    text = re.sub(r"p\.\d+\s*\n", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ============================================================
# Article + paragraph detection
# ============================================================

# Matches: "Article 5" "Art. 13bis" "Article 1er"
ART_PATTERN = re.compile(
    r"(?:^|\n)\s*(Art(?:icle)?\.?\s*(\d+[a-z]*(?:bis|ter|quater|quinquies|sexies)?(?:er)?))\s*\.?\s*[-–—.]?\s*",
    re.IGNORECASE
)

# Matches: "§ 1er" "§ 2" "§ 3"
PARA_PATTERN = re.compile(
    r"§\s*(\d+)(?:er)?",
    re.IGNORECASE
)


def parse_article_number(text: str):
    """Extrait le numéro d'article du début d'un chunk."""
    m = ART_PATTERN.match(text.strip())
    if m:
        return m.group(2).strip().rstrip(".")
    # Try at start of text
    m = ART_PATTERN.search(text[:100])
    if m:
        return m.group(2).strip().rstrip(".")
    return None


def parse_first_paragraph(text: str):
    """Extrait le premier § mentionné dans un chunk."""
    m = PARA_PATTERN.search(text[:200])
    if m:
        return m.group(1)
    return None


def build_citation(source_title: str, cda: str, article_num, paragraph):
    """Construit la citation prête à utiliser."""
    parts = []
    if article_num:
        # "Article 5" or "Article 1er"
        art_display = f"Article {article_num}"
        if paragraph:
            art_display += f" § {paragraph}"
        parts.append(art_display)

    parts.append(f"du {source_title}" if source_title else "")
    parts.append(f"(CDA {cda})")

    return " ".join(p for p in parts if p)


# ============================================================
# Chunking — par article avec § détecté
# ============================================================

def chunk_by_articles_v2(text: str):
    """Découpe par article et détecte article_number + paragraph."""
    # Split on article boundaries
    splits = list(ART_PATTERN.finditer(text))

    if len(splits) < 3:
        return None  # Not enough articles, use fallback

    chunks = []
    for i, match in enumerate(splits):
        start = match.start()
        end = splits[i + 1].start() if i + 1 < len(splits) else len(text)
        chunk_text = text[start:end].strip()

        if len(chunk_text) < MIN_CHUNK_SIZE and chunks:
            # Merge with previous
            chunks[-1]["content"] += "\n\n" + chunk_text
            continue

        article_num = match.group(2).strip().rstrip(".")
        paragraph = parse_first_paragraph(chunk_text)

        # If chunk too long, split by §
        if len(chunk_text) > MAX_CHUNK_SIZE:
            sub_chunks = split_by_paragraphs(chunk_text, article_num)
            chunks.extend(sub_chunks)
        else:
            chunks.append({
                "article_number": article_num,
                "paragraph": paragraph,
                "content": chunk_text,
            })

    return chunks


def split_by_paragraphs(text: str, article_num: str):
    """Split un article trop long par ses §."""
    para_splits = list(PARA_PATTERN.finditer(text))

    if len(para_splits) < 2:
        # Can't split by §, split by size
        return split_by_size(text, article_num)

    chunks = []
    for i, match in enumerate(para_splits):
        start = match.start()
        end = para_splits[i + 1].start() if i + 1 < len(para_splits) else len(text)
        chunk_text = text[start:end].strip()

        # For first chunk, include text before first §
        if i == 0 and start > 50:
            chunk_text = text[:end].strip()

        if len(chunk_text) < MIN_CHUNK_SIZE and chunks:
            chunks[-1]["content"] += "\n\n" + chunk_text
            continue

        para_num = match.group(1)
        chunks.append({
            "article_number": article_num,
            "paragraph": para_num,
            "content": chunk_text[:MAX_CHUNK_SIZE],
        })

    return chunks


def split_by_size(text: str, article_num: str = None):
    """Fallback: split by size."""
    chunks = []
    words = text.split()
    current = []
    current_size = 0

    for word in words:
        current.append(word)
        current_size += len(word) + 1
        if current_size >= MAX_CHUNK_SIZE:
            chunk_text = " ".join(current)
            chunks.append({
                "article_number": article_num,
                "paragraph": None,
                "content": chunk_text,
            })
            current = []
            current_size = 0

    if current:
        chunk_text = " ".join(current)
        if chunks and len(chunk_text) < MIN_CHUNK_SIZE:
            chunks[-1]["content"] += " " + chunk_text
        else:
            chunks.append({
                "article_number": article_num,
                "paragraph": None,
                "content": chunk_text,
            })

    return chunks


def smart_chunk_v2(text: str):
    """Article-based chunking with fallback."""
    result = chunk_by_articles_v2(text)
    if result:
        return result
    return split_by_size(text)


# ============================================================
# SQL generation — V2 with structured columns
# ============================================================

def escape_sql(text: str) -> str:
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_sql_v2(all_docs: list, output_path: str):
    with open(output_path, "w", encoding="utf-8") as f:
        total = sum(len(d["chunks"]) for d in all_docs)
        f.write(f"-- Legal chunks V2 — {total} chunks\n")
        f.write("-- Avec article_number, paragraph, citation_display\n\n")

        for doc in all_docs:
            cda = doc["cda"]
            source_title = doc["source_title"]
            short_title = doc.get("short_title", source_title)
            edu_level = doc.get("education_level", "commun")
            f.write(f"\n-- CDA {cda}: {source_title} ({len(doc['chunks'])} chunks)\n")

            for i, chunk in enumerate(doc["chunks"]):
                art = chunk.get("article_number")
                para = chunk.get("paragraph")
                topics = chunk.get("topics", [])
                content = escape_sql(chunk["content"][:MAX_CHUNK_SIZE])
                title_escaped = escape_sql(source_title)
                short_escaped = escape_sql(short_title)

                # Build chunk_title
                if art:
                    chunk_title = f"Art. {art}"
                    if para:
                        chunk_title += f" § {para}"
                else:
                    chunk_title = f"Section {i + 1}"
                chunk_title_escaped = escape_sql(chunk_title)

                # Build citation_display
                citation = build_citation(source_title, cda, art, para)
                citation_escaped = escape_sql(citation)

                # SQL values
                art_sql = f"'{escape_sql(art)}'" if art else "NULL"
                para_sql = f"'{escape_sql(para)}'" if para else "NULL"
                topics_sql = "ARRAY[" + ",".join(f"'{escape_sql(t)}'" for t in topics) + "]" if topics else "NULL"

                f.write(
                    f"INSERT INTO public.legal_chunks "
                    f"(cda_code, chunk_index, chunk_title, content, source_title, source_short_title, "
                    f"article_number, paragraph, citation_display, topics, education_level) "
                    f"VALUES ('{cda}', {i}, '{chunk_title_escaped}', '{content}', "
                    f"'{title_escaped}', '{short_escaped}', "
                    f"{art_sql}, {para_sql}, '{citation_escaped}', {topics_sql}, '{edu_level}');\n"
                )

        f.write(f"\n-- Total: {total} chunks\n")


# ============================================================
# Main
# ============================================================

def process_phase(dirs: list, label: str) -> list:
    all_docs = []

    for dirname in dirs:
        dirpath = os.path.join(BASE_DIR, dirname)
        if not os.path.isdir(dirpath):
            print(f"  [SKIP] {dirname}")
            continue

        for filename in sorted(os.listdir(dirpath)):
            if not filename.endswith(".pdf"):
                continue

            cda = filename.replace(".pdf", "")
            filepath = os.path.join(dirpath, filename)
            meta = CDA_META.get(cda, (f"CDA {cda}", f"CDA {cda}", "commun"))
            source_title = meta[0]
            short_title = meta[1]
            edu_level = meta[2]

            print(f"  [{label}] CDA {cda:>5s} — ", end="")

            text = extract_text(filepath)
            text = clean_text(text)
            chunks = smart_chunk_v2(text)

            # Count articles detected
            art_count = sum(1 for c in chunks if c.get("article_number"))
            para_count = sum(1 for c in chunks if c.get("paragraph"))
            total_chars = sum(len(c["content"]) for c in chunks)

            print(f"{len(chunks):>3d} chunks ({art_count} articles, {para_count} §), {total_chars:>8,} chars")

            # Detect topics for each chunk
            for chunk in chunks:
                chunk["topics"] = detect_topics(chunk["content"])

            all_docs.append({
                "cda": cda,
                "source_title": source_title,
                "short_title": short_title,
                "education_level": edu_level,
                "chunks": chunks,
            })

    return all_docs


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 60)
    print("Extraction V2 — chunks structurés avec citations exactes")
    print("=" * 60)

    print("\n--- PHASE 1 : Incontournables ---")
    phase1 = process_phase(PHASE_1_DIRS, "P1")
    output_p1 = os.path.join(OUTPUT_DIR, "legal_chunks_v2_phase1.sql")
    generate_sql_v2(phase1, output_p1)
    t1 = sum(len(d["chunks"]) for d in phase1)
    a1 = sum(sum(1 for c in d["chunks"] if c.get("article_number")) for d in phase1)
    print(f"\n  → {t1} chunks, {a1} avec article_number")

    print("\n--- PHASE 2 : Facultatifs ---")
    phase2 = process_phase(PHASE_2_DIRS, "P2")
    output_p2 = os.path.join(OUTPUT_DIR, "legal_chunks_v2_phase2.sql")
    generate_sql_v2(phase2, output_p2)
    t2 = sum(len(d["chunks"]) for d in phase2)
    a2 = sum(sum(1 for c in d["chunks"] if c.get("article_number")) for d in phase2)
    print(f"\n  → {t2} chunks, {a2} avec article_number")

    print(f"\n{'='*60}")
    print(f"TOTAL: {t1+t2} chunks, {a1+a2} avec article exact")
    print(f"{'='*60}")
    print("\nPROCÉDURE :")
    print("1. Exécuter 008_legal_chunks_v2.sql (ajoute les colonnes)")
    print("2. TRUNCATE public.legal_chunks;")
    print("3. Exécuter legal_chunks_v2_phase1.sql")
    print("4. Exécuter legal_chunks_v2_phase2.sql")


if __name__ == "__main__":
    main()
