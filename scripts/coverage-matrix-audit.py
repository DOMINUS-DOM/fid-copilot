#!/usr/bin/env python3
"""
Audit de couverture pour la matrice FID — vérifie la présence en base,
le routage thématique et le pivot injection pour les 15 cas critiques.
"""

import json
import urllib.request
import urllib.error
import urllib.parse

SUPABASE_URL = "https://lxkmufsfehpkudpxkzxr.supabase.co"
SUPABASE_KEY = "sb_publishable_9iToG5wloKgjpEWD2-8Plw_E72IoRLW"

CASES = [
    {
        "id": "voeren",
        "name": "Voeren / Fourons / grands-parents",
        "theme": "Régime linguistique",
        "cda": "4329",
        "articles": ["6"],
        "fts_terms": "commune chef famille langue",
    },
    {
        "id": "ise",
        "name": "Indice socio-économique",
        "theme": "Encadrement différencié",
        "cda": "34295",
        "articles": ["3"],
        "fts_terms": "indice socio-économique critère",
    },
    {
        "id": "exclusion-15-janv",
        "name": "Exclusion après 15 janvier / subventions",
        "theme": "Pacte scolaire",
        "cda": "5108",
        "articles": ["73"],
        "fts_terms": "subvention fonctionnement exclusion",
    },
    {
        "id": "absences-heure",
        "name": "Relevé absences à chaque heure",
        "theme": "Fréquentation",
        "cda": "49466",
        "articles": ["1.7.1-9"],
        "fts_terms": "registre fréquentation absence",
    },
    {
        "id": "amenagements",
        "name": "Aménagements raisonnables",
        "theme": "Besoins spécifiques",
        "cda": "49466",
        "articles": ["1.7.8-1"],
        "fts_terms": "aménagement raisonnable besoins",
    },
    {
        "id": "exclusion-ecartement",
        "name": "Exclusion définitive / écartement",
        "theme": "Discipline",
        "cda": "49466",
        "articles": ["1.7.9-4", "1.7.9-5", "1.7.9-6"],
        "fts_terms": "exclusion définitive écartement",
    },
    {
        "id": "dacce-parents",
        "name": "Parents et accès au DAccE",
        "theme": "DAccE",
        "cda": "49466",
        "articles": ["1.10.2-2", "1.10.2-3", "1.10.3-1"],
        "fts_terms": "DAccE parent accès",
    },
    {
        "id": "evaluations-ext",
        "name": "Évaluations externes",
        "theme": "Évaluation",
        "cda": "49466",
        "articles": ["1.6.3-10"],
        "fts_terms": "évaluation externe passation",
    },
    {
        "id": "implantations",
        "name": "Deux implantations / règlement études",
        "theme": "Organisation",
        "cda": "49466",
        "articles": ["1.5.1-8"],
        "fts_terms": "règlement études implantation",
    },
    {
        "id": "personne-confiance",
        "name": "Personne de confiance / harcèlement",
        "theme": "Bien-être",
        "cda": "45031",
        "articles": ["32sexies"],
        "fts_terms": "personne confiance harcèlement",
    },
    {
        "id": "changement-option",
        "name": "Changement d'option après 15/11",
        "theme": "Admission / inscription",
        "cda": "10450",
        "articles": ["12", "19"],
        "fts_terms": "changement option novembre",
    },
    {
        "id": "periodes-45min",
        "name": "Périodes de 45 minutes",
        "theme": "Organisation horaire",
        "cda": "10450",
        "articles": ["2"],
        "fts_terms": "période 45 minutes horaire",
    },
    {
        "id": "daspa",
        "name": "DASPA / primo-arrivants",
        "theme": "DASPA / FLA",
        "cda": "46275",
        "articles": ["2", "3"],
        "fts_terms": "DASPA primo-arrivant dispositif",
    },
    {
        "id": "obligation-scolaire",
        "name": "Obligation scolaire à temps plein",
        "theme": "Obligation scolaire",
        "cda": "9547",
        "articles": ["1"],
        "fts_terms": "obligation scolaire temps plein",
    },
    {
        "id": "missions-prioritaires",
        "name": "Missions prioritaires de l'enseignement",
        "theme": "Missions",
        "cda": "21557",
        "articles": ["6"],
        "fts_terms": "missions prioritaires enseignement",
    },
]


def supabase_get(endpoint):
    url = "{}/rest/v1/{}".format(SUPABASE_URL, endpoint)
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer {}".format(SUPABASE_KEY),
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except:
        return []


def check_article_exists(cda, article):
    data = supabase_get(
        "legal_chunks?cda_code=eq.{}&article_number=eq.{}&select=id,article_number,content&limit=1".format(
            cda, urllib.parse.quote(article, safe='')))
    return len(data) > 0, data[0] if data else None


def check_cda_has_chunks(cda):
    data = supabase_get(
        "legal_chunks?cda_code=eq.{}&select=id&limit=1".format(cda))
    return len(data) > 0


def check_fts(cda, terms, limit=5):
    encoded = urllib.parse.quote(terms.replace(" ", " | "), safe='')
    data = supabase_get(
        "legal_chunks?cda_code=eq.{}&content=wfts(french).{}&select=article_number&limit={}".format(
            cda, encoded, limit))
    return [d.get('article_number', '?') for d in data] if data else []


def main():
    results = []

    for case in CASES:
        cda = case['cda']
        print("Checking: {} (CDA {})...".format(case['name'], cda))

        # 1. CDA has chunks at all?
        cda_exists = check_cda_has_chunks(cda)

        # 2. Each pivot article exists?
        articles_status = {}
        for art in case['articles']:
            exists, chunk = check_article_exists(cda, art)
            articles_status[art] = {
                "exists": exists,
                "preview": chunk['content'][:100].replace('\n', ' ') if chunk else None,
            }

        # 3. FTS returns relevant results?
        fts_results = check_fts(cda, case['fts_terms'])
        fts_has_pivot = any(
            art in fts_results for art in case['articles']
        )

        # Compute status
        all_articles_exist = all(a['exists'] for a in articles_status.values())

        result = {
            "id": case['id'],
            "name": case['name'],
            "theme": case['theme'],
            "cda": cda,
            "articles": case['articles'],
            "cda_in_db": cda_exists,
            "articles_present": articles_status,
            "all_articles_ok": all_articles_exist,
            "fts_results": fts_results[:5],
            "fts_has_pivot": fts_has_pivot,
        }
        results.append(result)

    # Output JSON
    import os
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", "coverage-matrix-audit.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "=" * 90)
    print("RÉSUMÉ DE L'AUDIT DE COUVERTURE")
    print("=" * 90)
    print("\n{:<35} {:<8} {:<15} {:<12} {:<10}".format(
        "Cas", "CDA DB", "Articles", "FTS pivot", "Global"))
    print("-" * 90)

    for r in results:
        cda_ok = "✅" if r['cda_in_db'] else "❌"
        art_ok = "✅ {}/{}".format(
            sum(1 for a in r['articles_present'].values() if a['exists']),
            len(r['articles_present'])
        )
        fts_ok = "✅" if r['fts_has_pivot'] else "🟡"

        if r['all_articles_ok'] and r['fts_has_pivot']:
            overall = "✅"
        elif r['cda_in_db'] and r['all_articles_ok']:
            overall = "⚠️"
        elif r['cda_in_db']:
            overall = "⚠️"
        else:
            overall = "❌"

        print("{:<35} {:<8} {:<15} {:<12} {:<10}".format(
            r['name'][:34], cda_ok, art_ok, fts_ok, overall))

    print("\n  Audit sauvegardé: {}".format(output_path))


if __name__ == "__main__":
    main()
