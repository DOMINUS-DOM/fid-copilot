import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// GET /api/feedback/analysis
// Returns downvoted responses with metadata + frequency analysis
// Query params:
//   ?limit=50        (default 50, max 200)
//   ?since=2025-01-01 (optional date filter)
// ============================================================

interface ArticleFrequency {
  article: string;
  count: number;
}

interface CdaFrequency {
  cda: string;
  count: number;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
    const since = url.searchParams.get("since");

    let query = supabase
      .from("assistant_logs")
      .select("id, question, response, metadata, created_at")
      .eq("user_id", user.id)
      .eq("rating", "down")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error("[API feedback/analysis]", error);
      return NextResponse.json({ error: "Erreur requête" }, { status: 500 });
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json({
        count: 0,
        entries: [],
        frequentArticles: [],
        frequentCda: [],
        summary: "Aucune réponse avec feedback négatif.",
      });
    }

    // Build entries
    const entries = logs.map((log) => {
      const meta = log.metadata as Record<string, unknown> | null;
      return {
        id: log.id,
        date: log.created_at,
        question: log.question,
        response: log.response?.slice(0, 500) ?? null,
        responseFull: log.response ?? null,
        model: meta?.model ?? null,
        confidence: meta?.confidence ?? null,
        cdaRouted: meta?.cdaRouted ?? [],
        pivotArticles: meta?.pivotArticles ?? [],
        articlesSentToLlm: meta?.articlesSentToLlm ?? [],
        citationGuard: meta?.citationGuard ?? null,
        latencyMs: meta?.latencyMs ?? null,
      };
    });

    // Frequency analysis: articles in downvoted responses
    const articleCounts = new Map<string, number>();
    const cdaCounts = new Map<string, number>();

    for (const entry of entries) {
      const articles = entry.articlesSentToLlm as string[];
      if (Array.isArray(articles)) {
        for (const art of articles) {
          articleCounts.set(art, (articleCounts.get(art) || 0) + 1);
        }
      }
      const cdas = entry.cdaRouted as string[];
      if (Array.isArray(cdas)) {
        for (const cda of cdas) {
          cdaCounts.set(cda, (cdaCounts.get(cda) || 0) + 1);
        }
      }
    }

    const frequentArticles: ArticleFrequency[] = [...articleCounts.entries()]
      .map(([article, count]) => ({ article, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const frequentCda: CdaFrequency[] = [...cdaCounts.entries()]
      .map(([cda, count]) => ({ cda, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      count: entries.length,
      entries: entries.map(({ responseFull, ...rest }) => rest),
      frequentArticles,
      frequentCda,
      summary: `${entries.length} réponse(s) avec feedback négatif. Top CDA : ${frequentCda.slice(0, 3).map((c) => c.cda).join(", ") || "—"}. Top articles : ${frequentArticles.slice(0, 3).map((a) => a.article).join(", ") || "—"}.`,
    });
  } catch (error) {
    console.error("[API feedback/analysis]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
