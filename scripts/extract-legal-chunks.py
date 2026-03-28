#!/usr/bin/env python3
"""
Extraction et chunking des PDFs légaux FID.

Usage:
  python3 scripts/extract-legal-chunks.py

Prérequis:
  pip install pymupdf

Produit:
  scripts/output/legal_chunks.sql — fichier SQL à exécuter dans Supabase

Stratégie de chunking:
  1. Extrait le texte de chaque PDF
  2. Découpe par article (regex "Art." / "Article")
  3. Si pas d'articles détectés, découpe par pages (groupes de 3)
  4. Chaque chunk fait entre 200 et 5000 caractères
  5. Les chunks trop courts sont fusionnés avec le suivant
"""

import fitz  # pymupdf
import os
import re
import sys

# ============================================================
# Configuration
# ============================================================

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "legal-pdfs", "Textes légaux")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")

# Phase 1 : incontournables uniquement
PHASE_1_DIRS = [
    "1- documents communs - les incontournables",
    "2- Secondaire ordinaire et spécialisé - les incontournables",
    "3- ESAHR - incontournables",
]

# Phase 2 : facultatifs
PHASE_2_DIRS = [
    "4 - communs facultatifs",
    "5- secondaire ordinaire et spécialisé - facultatifs",
    "6- ESAHR - Facultatifs",
    "Pour info",
]

MIN_CHUNK_SIZE = 200   # caractères minimum par chunk
MAX_CHUNK_SIZE = 5000  # caractères maximum par chunk


# ============================================================
# Extraction
# ============================================================

def extract_text(pdf_path: str) -> str:
    """Extrait tout le texte d'un PDF."""
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def clean_text(text: str) -> str:
    """Nettoie le texte extrait."""
    # Supprimer les en-têtes/pieds de page répétitifs (CDA, numéros de page)
    text = re.sub(r"Centre de documentation administrative\s*\n", "", text)
    text = re.sub(r"Secrétariat général\s*\n", "", text)
    text = re.sub(r"Mise à jour au \d{2}-\d{2}-\d{4}\s*\n", "", text)
    text = re.sub(r"p\.\d+\s*\n", "", text)
    # Supprimer les lignes vides multiples
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ============================================================
# Chunking
# ============================================================

def chunk_by_articles(text: str) -> list[dict]:
    """Découpe le texte par articles juridiques."""
    # Pattern: "Art. 12." ou "Article 12." ou "Art. 12bis."
    pattern = r"(?=(?:^|\n)\s*(?:Art(?:icle)?\.?\s*\d+[a-z]*(?:bis|ter|quater|quinquies|sexies)?\.?))"
    parts = re.split(pattern, text)

    chunks = []
    for part in parts:
        part = part.strip()
        if not part:
            continue

        # Extraire le titre de l'article
        title_match = re.match(
            r"(Art(?:icle)?\.?\s*\d+[a-z]*(?:bis|ter|quater|quinquies|sexies)?\.?(?:\s*[-–—]\s*[^\n]{0,80})?)",
            part
        )
        title = title_match.group(1).strip() if title_match else ""

        chunks.append({"title": title, "content": part})

    return chunks


def chunk_by_pages(text: str, pages_per_chunk: int = 3) -> list[dict]:
    """Découpe par blocs de texte (fallback si pas d'articles)."""
    # Découpe approximative par taille
    target_size = MAX_CHUNK_SIZE
    chunks = []
    words = text.split()
    current = []
    current_size = 0

    for word in words:
        current.append(word)
        current_size += len(word) + 1
        if current_size >= target_size:
            chunk_text = " ".join(current)
            chunks.append({"title": f"Section {len(chunks) + 1}", "content": chunk_text})
            current = []
            current_size = 0

    if current:
        chunk_text = " ".join(current)
        if chunks and len(chunk_text) < MIN_CHUNK_SIZE:
            # Fusionner avec le dernier chunk
            chunks[-1]["content"] += " " + chunk_text
        else:
            chunks.append({"title": f"Section {len(chunks) + 1}", "content": chunk_text})

    return chunks


def smart_chunk(text: str) -> list[dict]:
    """Choisit la meilleure stratégie de chunking."""
    # Essayer d'abord par articles
    chunks = chunk_by_articles(text)

    # Si on a trouvé assez d'articles (>5), on garde
    if len(chunks) > 5:
        # Fusionner les chunks trop petits
        merged = []
        for chunk in chunks:
            if merged and len(merged[-1]["content"]) < MIN_CHUNK_SIZE:
                merged[-1]["content"] += "\n\n" + chunk["content"]
                if chunk["title"]:
                    merged[-1]["title"] += " / " + chunk["title"]
            elif len(chunk["content"]) > MAX_CHUNK_SIZE:
                # Découper les chunks trop gros
                sub_chunks = chunk_by_pages(chunk["content"])
                for j, sc in enumerate(sub_chunks):
                    sc["title"] = f"{chunk['title']} (partie {j + 1})" if chunk["title"] else sc["title"]
                merged.extend(sub_chunks)
            else:
                merged.append(chunk)
        return merged

    # Fallback : découpage par taille
    return chunk_by_pages(text)


# ============================================================
# SQL generation
# ============================================================

def escape_sql(text: str) -> str:
    """Échappe le texte pour SQL."""
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_sql(all_chunks: list[dict], output_path: str):
    """Génère le fichier SQL d'insertion."""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("-- ============================================================\n")
        f.write("-- Legal chunks — généré automatiquement\n")
        f.write(f"-- {sum(len(c['chunks']) for c in all_chunks)} chunks total\n")
        f.write("-- ============================================================\n\n")
        f.write("-- Vider les chunks existants avant réimport\n")
        f.write("-- TRUNCATE public.legal_chunks;\n\n")

        for doc in all_chunks:
            cda = doc["cda"]
            f.write(f"\n-- CDA {cda} ({len(doc['chunks'])} chunks)\n")

            for i, chunk in enumerate(doc["chunks"]):
                title = escape_sql(chunk["title"][:200])
                content = escape_sql(chunk["content"][:MAX_CHUNK_SIZE])

                f.write(
                    f"INSERT INTO public.legal_chunks (cda_code, chunk_index, chunk_title, content) "
                    f"VALUES ('{cda}', {i}, '{title}', '{content}');\n"
                )

        f.write(f"\n-- Total: {sum(len(c['chunks']) for c in all_chunks)} chunks\n")


# ============================================================
# Main
# ============================================================

def process_phase(dirs: list[str], label: str) -> list[dict]:
    """Traite tous les PDFs d'une phase."""
    all_chunks = []

    for dirname in dirs:
        dirpath = os.path.join(BASE_DIR, dirname)
        if not os.path.isdir(dirpath):
            print(f"  [SKIP] {dirname} — répertoire non trouvé")
            continue

        for filename in sorted(os.listdir(dirpath)):
            if not filename.endswith(".pdf"):
                continue

            cda = filename.replace(".pdf", "")
            filepath = os.path.join(dirpath, filename)

            print(f"  [{label}] CDA {cda:>5s} — ", end="")

            text = extract_text(filepath)
            text = clean_text(text)
            chunks = smart_chunk(text)

            total_chars = sum(len(c["content"]) for c in chunks)
            print(f"{len(chunks):>3d} chunks, {total_chars:>8,} chars")

            all_chunks.append({"cda": cda, "chunks": chunks})

    return all_chunks


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 60)
    print("Extraction des textes légaux FID")
    print("=" * 60)

    # Phase 1 : incontournables
    print("\n--- PHASE 1 : Incontournables ---")
    phase1 = process_phase(PHASE_1_DIRS, "P1")

    output_p1 = os.path.join(OUTPUT_DIR, "legal_chunks_phase1.sql")
    generate_sql(phase1, output_p1)
    total_p1 = sum(len(c["chunks"]) for c in phase1)
    print(f"\n  → {output_p1}")
    print(f"  → {total_p1} chunks générés")

    # Phase 2 : facultatifs
    print("\n--- PHASE 2 : Facultatifs ---")
    phase2 = process_phase(PHASE_2_DIRS, "P2")

    output_p2 = os.path.join(OUTPUT_DIR, "legal_chunks_phase2.sql")
    generate_sql(phase2, output_p2)
    total_p2 = sum(len(c["chunks"]) for c in phase2)
    print(f"\n  → {output_p2}")
    print(f"  → {total_p2} chunks générés")

    # Résumé
    print("\n" + "=" * 60)
    print(f"TOTAL : {total_p1 + total_p2} chunks")
    print(f"Phase 1 (incontournables) : {total_p1} chunks — EXÉCUTER EN PREMIER")
    print(f"Phase 2 (facultatifs)     : {total_p2} chunks — exécuter ensuite")
    print("=" * 60)
    print("\nProchaines étapes :")
    print("1. Exécuter 005_legal_chunks.sql dans Supabase (crée la table)")
    print("2. Exécuter scripts/output/legal_chunks_phase1.sql (incontournables)")
    print("3. Tester l'assistant")
    print("4. Exécuter scripts/output/legal_chunks_phase2.sql (facultatifs)")


if __name__ == "__main__":
    main()
