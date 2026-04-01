#!/usr/bin/env python3
"""
Gallilex Legal Text Ingestion Script
=====================================
Downloads PDFs from Gallilex, extracts articles, and generates SQL
for insertion into the legal_chunks table in Supabase.

Usage:
    python3 scripts/ingest-gallilex.py

Output:
    scripts/output/legal_chunks_insert.sql
"""

import os
import re
import sys
import time
import urllib.request
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("Installing pypdf...")
    os.system("pip3 install pypdf")
    from pypdf import PdfReader

# ============================================================
# CDA CODES TO INGEST — complete FID exam corpus
# ============================================================

CDA_PDF_MAP = {
    # Format: CDA_CODE: (title, pdf_path_suffix)
    # PDF paths discovered from Gallilex website structure
    "4329": ("Loi du 30 juillet 1963 — Régime linguistique dans l'enseignement", "2025-08/4329_0010.pdf"),
    "5108": ("Loi du 29 mai 1959 — Pacte scolaire", "2026-01/5108_0076.pdf"),
    "9547": ("Loi du 29 juin 1983 — Obligation scolaire", "2025-08/9547_0012.pdf"),
    "10450": ("AR du 29 juin 1984 — Organisation de l'enseignement secondaire", "2025-08/10450_0066.pdf"),
    "16421": ("Décret du 3 juillet 1991 — Enseignement en alternance", "2025-08/16421_0030.pdf"),
    "17144": ("AR — Organisation secondaire plein exercice", "2025-08/17144_0025.pdf"),
    "21557": ("Décret du 24 juillet 1997 — Missions prioritaires", "2025-08/21557_0059.pdf"),
    "28737": ("Décret du 3 mars 2004 — Enseignement spécialisé", "2025-08/28737_0036.pdf"),
    "30998": ("Décret — Organisation du 1er degré secondaire", "2025-08/30998_0012.pdf"),
    "31723": ("Décret du 12 janvier 2007 — Citoyenneté à l'école", "2025-08/31723_0004.pdf"),
    "31886": ("Décret du 2 février 2007 — Statut des directeurs", "2025-08/31886_0016.pdf"),
    "32365": ("Décret du 11 mai 2007 — Immersion linguistique", "2025-08/32365_0006.pdf"),
    "34295": ("Décret du 30 avril 2009 — Encadrement différencié", "2026-01/34295_0034.pdf"),
    "40701": ("Décret du 11 avril 2014 — Titres et fonctions", "2025-08/40701_0016.pdf"),
    "45031": ("Loi du 4 août 1996 — Bien-être au travail", "2025-08/45031_0006.pdf"),
    "45593": ("Décret du 13 septembre 2018 — Contrats d'objectifs", "2025-08/45593_0006.pdf"),
    "45721": ("AGCF du 6 novembre 2018 — Répertoire des options", "2025-08/45721_0004.pdf"),
    "46239": ("Décret — Inspection et pilotage", "2025-08/46239_0004.pdf"),
    "46275": ("Décret du 7 février 2019 — DASPA et FLA", "2025-08/46275_0006.pdf"),
    "46287": ("Décret du 14 mars 2019 — Organisation du travail", "2025-08/46287_0006.pdf"),
    "47114": ("AG du 3 juillet 2019 — Fonction d'éducateur", "2025-08/47114_0002.pdf"),
    "47237": ("Décret du 10 janvier 2019 — Inspection", "2025-08/47237_0004.pdf"),
    "49466": ("Code de l'enseignement fondamental et secondaire", "2025-08/49466_0040.pdf"),
}

GALLILEX_PDF_BASE = "https://gallilex.cfwb.be/sites/default/files/textes-normatifs"

OUTPUT_DIR = Path(__file__).parent / "output"
PDF_DIR = Path(__file__).parent / "pdfs"

# ============================================================
# PDF DOWNLOAD
# ============================================================

def download_pdf(cda_code: str, pdf_suffix: str) -> Path:
    """Download a PDF from Gallilex if not already cached."""
    pdf_path = PDF_DIR / f"{cda_code}.pdf"
    if pdf_path.exists():
        print(f"  [cached] {cda_code}.pdf")
        return pdf_path

    url = f"{GALLILEX_PDF_BASE}/{pdf_suffix}"
    print(f"  [download] {url}")
    try:
        urllib.request.urlretrieve(url, pdf_path)
        time.sleep(1)  # Be nice to Gallilex servers
    except Exception as e:
        print(f"  [ERROR] Failed to download CDA {cda_code}: {e}")
        return None
    return pdf_path

# ============================================================
# TEXT EXTRACTION
# ============================================================

def extract_text(pdf_path: Path) -> str:
    """Extract all text from a PDF."""
    try:
        reader = PdfReader(str(pdf_path))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"  [ERROR] PDF extraction failed: {e}")
        return ""

# ============================================================
# ARTICLE EXTRACTION
# ============================================================

# Pattern to match article headers like "Article 3.", "Article 10.", "Article 1er."
ARTICLE_PATTERN = re.compile(
    r'(?:^|\n)\s*(Article\s+(\d+(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies)?(?:\s*er)?)\s*[\.\-–—])',
    re.IGNORECASE | re.MULTILINE
)

def extract_articles(text: str, cda_code: str, title: str) -> list:
    """Split text into article-level chunks."""
    matches = list(ARTICLE_PATTERN.finditer(text))
    if not matches:
        print(f"  [WARN] No articles found in CDA {cda_code}")
        return []

    articles = []
    for i, match in enumerate(matches):
        art_num = match.group(2).strip().replace(" ", "")
        # Clean "1er" to "1"
        art_num_clean = re.sub(r'\s*er$', '', art_num)

        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else min(start + 5000, len(text))

        content = text[start:end].strip()

        # Clean up content
        content = re.sub(r'\n{3,}', '\n\n', content)
        content = re.sub(r'Lois \d+\s+p\.\d+', '', content)
        content = re.sub(r'Centre de documentation.*?(?=\n)', '', content)
        content = re.sub(r'Secrétariat général.*?(?=\n)', '', content)
        content = re.sub(r'Mise à jour.*?(?=\n)', '', content)
        content = content.strip()

        # Skip very short articles (likely parsing artifacts)
        if len(content) < 30:
            continue

        # Truncate very long articles
        if len(content) > 3000:
            content = content[:3000] + "..."

        # Extract paragraph if present
        paragraph = None
        para_match = re.search(r'§\s*(\d+(?:bis|ter)?)', content[:200])
        if para_match:
            paragraph = para_match.group(1)

        # Build citation display
        citation = f"Article {art_num_clean}"
        if paragraph:
            citation += f", §{paragraph}"
        citation += f" du {title} (CDA {cda_code})"

        # Build chunk title
        chunk_title = f"Art. {art_num_clean}"
        # Try to extract a meaningful title from first line
        first_line = content.split('\n')[0] if '\n' in content else content[:80]
        if '-' in first_line and len(first_line) < 120:
            chunk_title = first_line.split('-', 1)[1].strip()[:60] if '-' in first_line else chunk_title

        articles.append({
            "cda_code": cda_code,
            "article_number": art_num_clean,
            "paragraph": paragraph,
            "chunk_title": chunk_title,
            "content": content,
            "citation_display": citation,
        })

    return articles

# ============================================================
# SQL GENERATION
# ============================================================

def escape_sql(s: str) -> str:
    """Escape single quotes for SQL."""
    return s.replace("'", "''") if s else ""

def generate_sql(all_chunks: list) -> str:
    """Generate SQL INSERT statements."""
    if not all_chunks:
        return "-- No chunks to insert"

    lines = ["-- Auto-generated by ingest-gallilex.py",
             "-- Total chunks: " + str(len(all_chunks)),
             "",
             "INSERT INTO public.legal_chunks (cda_code, chunk_title, content, citation_display, article_number, paragraph)",
             "VALUES"]

    values = []
    for chunk in all_chunks:
        val = (
            f"('{escape_sql(chunk['cda_code'])}', "
            f"'{escape_sql(chunk['chunk_title'][:100])}', "
            f"'{escape_sql(chunk['content'])}', "
            f"'{escape_sql(chunk['citation_display'])}', "
            f"'{escape_sql(chunk['article_number'])}', "
            f"{'NULL' if not chunk['paragraph'] else repr(chunk['paragraph'])})"
        )
        values.append(val)

    # Split into batches of 50 to avoid SQL statement too large
    batches = []
    for i in range(0, len(values), 50):
        batch = values[i:i+50]
        batch_sql = "INSERT INTO public.legal_chunks (cda_code, chunk_title, content, citation_display, article_number, paragraph)\nVALUES\n"
        batch_sql += ",\n".join(batch) + ";\n"
        batches.append(batch_sql)

    return "\n\n".join(batches)

# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 60)
    print("Gallilex Legal Text Ingestion")
    print("=" * 60)

    # Create directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    all_chunks = []
    stats = {"downloaded": 0, "failed": 0, "articles": 0}

    for cda_code, (title, pdf_suffix) in CDA_PDF_MAP.items():
        print(f"\n[CDA {cda_code}] {title}")

        # Download
        pdf_path = download_pdf(cda_code, pdf_suffix)
        if not pdf_path or not pdf_path.exists():
            stats["failed"] += 1
            continue
        stats["downloaded"] += 1

        # Extract text
        text = extract_text(pdf_path)
        if not text:
            print(f"  [WARN] Empty text for CDA {cda_code}")
            continue

        # Extract articles
        articles = extract_articles(text, cda_code, title)
        print(f"  → {len(articles)} articles extracted")
        stats["articles"] += len(articles)
        all_chunks.extend(articles)

    # Generate SQL
    print(f"\n{'=' * 60}")
    print(f"Total: {stats['downloaded']} PDFs, {stats['articles']} articles")
    print(f"Failed: {stats['failed']} PDFs")

    sql = generate_sql(all_chunks)
    sql_path = OUTPUT_DIR / "legal_chunks_insert.sql"
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"\nSQL written to: {sql_path}")
    print(f"File size: {os.path.getsize(sql_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
