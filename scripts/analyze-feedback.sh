#!/bin/bash
# ============================================================
# Analyse des feedbacks négatifs — FID Copilot
#
# Usage:
#   ./scripts/analyze-feedback.sh              # derniers 50
#   ./scripts/analyze-feedback.sh 20           # derniers 20
#   ./scripts/analyze-feedback.sh 100 2025-03-01  # depuis une date
#
# Nécessite: SUPABASE_URL et SUPABASE_SERVICE_KEY en env
#            ou un fichier .env.local à la racine du projet
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load env
if [ -f "$PROJECT_DIR/.env.local" ]; then
  export $(grep -E '^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_KEY)=' "$PROJECT_DIR/.env.local" | xargs)
fi

URL="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_URL:-}}"
KEY="${SUPABASE_SERVICE_KEY:-}"

if [ -z "$URL" ] || [ -z "$KEY" ]; then
  echo "❌ Variables manquantes: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_KEY"
  echo "   Ajoutez SUPABASE_SERVICE_KEY dans .env.local ou exportez-le."
  exit 1
fi

LIMIT="${1:-50}"
SINCE="${2:-}"

# Query downvoted logs directly via Supabase REST API
ENDPOINT="$URL/rest/v1/assistant_logs?rating=eq.down&order=created_at.desc&limit=$LIMIT&select=id,question,response,metadata,created_at"

if [ -n "$SINCE" ]; then
  ENDPOINT="$ENDPOINT&created_at=gte.$SINCE"
fi

echo "📊 Feedbacks négatifs (limit=$LIMIT${SINCE:+, depuis $SINCE})"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RESULT=$(curl -s "$ENDPOINT" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json")

COUNT=$(echo "$RESULT" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

if [ "$COUNT" = "0" ]; then
  echo "✅ Aucun feedback négatif trouvé."
  exit 0
fi

echo "Trouvé: $COUNT réponse(s) avec 👎"
echo ""

# Pretty print with python
echo "$RESULT" | python3 -c "
import sys, json
from collections import Counter

data = json.load(sys.stdin)

article_counts = Counter()
cda_counts = Counter()

for i, row in enumerate(data):
    meta = row.get('metadata') or {}
    date = (row.get('created_at') or '')[:16].replace('T', ' ')
    question = (row.get('question') or '')[:120]
    response = (row.get('response') or '')[:200]
    model = meta.get('model', '—')
    confidence = meta.get('confidence', '—')
    cdas = meta.get('cdaRouted', [])
    articles = meta.get('articlesSentToLlm', [])
    guard = meta.get('citationGuard', {})
    unverified = guard.get('unverified', []) if guard else []

    for a in (articles or []):
        article_counts[a] += 1
    for c in (cdas or []):
        cda_counts[c] += 1

    print(f'┌─ #{i+1} — {date}')
    print(f'│ Question : {question}')
    print(f'│ Modèle   : {model} | Confiance : {confidence}')
    print(f'│ CDA      : {', '.join(str(c) for c in cdas) if cdas else '—'}')
    print(f'│ Articles : {', '.join(str(a) for a in articles) if articles else '—'}')
    if unverified:
        print(f'│ ⚠ Non vérifiés : {', '.join(str(u) for u in unverified)}')
    print(f'│ Réponse  : {response}...')
    print(f'└─')
    print()

if article_counts:
    print('━━━ Articles les plus fréquents dans les 👎 ━━━')
    for art, cnt in article_counts.most_common(10):
        print(f'  Art. {art} — {cnt}x')
    print()

if cda_counts:
    print('━━━ CDA les plus fréquents dans les 👎 ━━━')
    for cda, cnt in cda_counts.most_common(10):
        print(f'  CDA {cda} — {cnt}x')
"
