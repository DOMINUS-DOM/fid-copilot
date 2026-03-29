#!/usr/bin/env python3
"""
Import legal_chunks directement dans Supabase via l'API REST.
Contourne la limite du SQL Editor en insérant par batch.

Usage:
  python3 scripts/import-chunks-supabase.py

Prérequis:
  pip install requests
"""

import json
import os
import re
import sys

try:
    import requests
except ImportError:
    print("Installation de requests...")
    os.system(f"{sys.executable} -m pip install requests")
    import requests

# ============================================================
# Configuration — lire depuis .env.local
# ============================================================

ENV_PATH = os.path.join(os.path.dirname(__file__), "..", ".env.local")

def read_env():
    env = {}
    with open(ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                key, val = line.split("=", 1)
                env[key.strip()] = val.strip()
    return env

env = read_env()
SUPABASE_URL = env.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERREUR: Variables SUPABASE manquantes dans .env.local")
    sys.exit(1)

API_URL = f"{SUPABASE_URL}/rest/v1/legal_chunks"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

BATCH_SIZE = 50  # rows per request

# ============================================================
# Parse SQL INSERT statements
# ============================================================

def parse_sql_file(filepath):
    """Parse les INSERT du fichier SQL en objets JSON."""
    rows = []

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex pour capturer les VALUES
    pattern = re.compile(
        r"INSERT INTO public\.legal_chunks \([^)]+\) VALUES \((.+?)\);",
        re.DOTALL
    )

    matches = pattern.findall(content)

    for match in matches:
        try:
            row = parse_values(match)
            if row:
                rows.append(row)
        except Exception as e:
            # Skip malformed rows
            continue

    return rows


def parse_values(values_str):
    """Parse une ligne VALUES SQL en dict."""
    # Champs attendus dans l'ordre:
    # cda_code, chunk_index, chunk_title, content, source_title, source_short_title,
    # article_number, paragraph, citation_display, topics, education_level

    parts = smart_split(values_str)

    if len(parts) < 11:
        return None

    row = {
        "cda_code": clean_str(parts[0]),
        "chunk_index": int(parts[1].strip()),
        "chunk_title": clean_str(parts[2]),
        "content": clean_str(parts[3]),
        "source_title": clean_str(parts[4]),
        "source_short_title": clean_str(parts[5]),
        "article_number": clean_nullable(parts[6]),
        "paragraph": clean_nullable(parts[7]),
        "citation_display": clean_str(parts[8]),
    }

    # Topics (ARRAY or NULL)
    topics_str = parts[9].strip()
    if topics_str == "NULL":
        row["topics"] = None
    else:
        # Parse ARRAY['a','b']
        topics_match = re.findall(r"'([^']*)'", topics_str)
        row["topics"] = topics_match if topics_match else None

    # Education level
    row["education_level"] = clean_nullable(parts[10])

    return row


def smart_split(s):
    """Split SQL VALUES en respectant les strings quotées."""
    parts = []
    current = ""
    in_string = False
    depth = 0
    i = 0

    while i < len(s):
        c = s[i]

        if c == "'" and not in_string:
            in_string = True
            current += c
        elif c == "'" and in_string:
            # Check for escaped quote ''
            if i + 1 < len(s) and s[i + 1] == "'":
                current += "''"
                i += 2
                continue
            else:
                in_string = False
                current += c
        elif c == "(" and not in_string:
            depth += 1
            current += c
        elif c == ")" and not in_string:
            depth -= 1
            current += c
        elif c == "," and not in_string and depth == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += c

        i += 1

    if current.strip():
        parts.append(current.strip())

    return parts


def clean_str(s):
    """Nettoie une valeur SQL string."""
    s = s.strip()
    if s.startswith("'") and s.endswith("'"):
        s = s[1:-1]
    return s.replace("''", "'").replace("\\\\", "\\")


def clean_nullable(s):
    """Nettoie une valeur SQL qui peut être NULL."""
    s = s.strip()
    if s == "NULL":
        return None
    return clean_str(s)


# ============================================================
# Batch insert via API
# ============================================================

def insert_batch(rows):
    """Insert un batch de rows via l'API REST Supabase."""
    resp = requests.post(API_URL, headers=HEADERS, json=rows)

    if resp.status_code not in (200, 201):
        print(f"  ERREUR {resp.status_code}: {resp.text[:200]}")
        return False
    return True


# ============================================================
# Main
# ============================================================

def process_file(filepath, label):
    print(f"\n{'='*60}")
    print(f"Import: {label}")
    print(f"Fichier: {filepath}")
    print(f"{'='*60}")

    print("Parsing du fichier SQL...")
    rows = parse_sql_file(filepath)
    print(f"  {len(rows)} rows parsées")

    if len(rows) == 0:
        print("  Aucune row trouvée. Vérifiez le fichier.")
        return 0

    total_inserted = 0
    total_batches = (len(rows) + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1

        success = insert_batch(batch)

        if success:
            total_inserted += len(batch)
            print(f"  Batch {batch_num}/{total_batches}: {len(batch)} rows ✓ (total: {total_inserted})")
        else:
            print(f"  Batch {batch_num}/{total_batches}: ÉCHEC — tentative row par row...")
            # Retry one by one
            for row in batch:
                if insert_batch([row]):
                    total_inserted += 1
                else:
                    print(f"    Row skip (CDA {row.get('cda_code', '?')} art {row.get('article_number', '?')})")

    print(f"\n  Total inséré: {total_inserted}/{len(rows)}")
    return total_inserted


def main():
    output_dir = os.path.join(os.path.dirname(__file__), "output")

    phase1_path = os.path.join(output_dir, "legal_chunks_v2_phase1.sql")
    phase2_path = os.path.join(output_dir, "legal_chunks_v2_phase2.sql")

    if not os.path.exists(phase1_path):
        print(f"ERREUR: Fichier non trouvé: {phase1_path}")
        print("Exécutez d'abord: python3 scripts/extract-legal-chunks-v2.py")
        sys.exit(1)

    print("=" * 60)
    print("Import des legal_chunks dans Supabase via API REST")
    print("=" * 60)
    print(f"URL: {SUPABASE_URL}")

    # Phase 1
    t1 = process_file(phase1_path, "Phase 1 — Incontournables")

    # Phase 2
    t2 = 0
    if os.path.exists(phase2_path):
        t2 = process_file(phase2_path, "Phase 2 — Facultatifs")

    print(f"\n{'='*60}")
    print(f"TERMINÉ: {t1 + t2} chunks importés au total")
    print(f"  Phase 1: {t1}")
    print(f"  Phase 2: {t2}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
