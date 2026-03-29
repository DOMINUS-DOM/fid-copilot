"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  type DecisionCategory,
  type DecisionUrgency,
  type AssistantSource,
  DECISION_CATEGORY_LABELS,
  DECISION_URGENCY_LABELS,
  CATEGORY_LABELS,
} from "@/types";
import {
  Scale,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";

export function DecisionEngine() {
  const [situation, setSituation] = useState("");
  const [category, setCategory] = useState<DecisionCategory | "">("");
  const [urgency, setUrgency] = useState<DecisionUrgency | "">("");
  const [analysis, setAnalysis] = useState("");
  const [sources, setSources] = useState<AssistantSource[]>([]);
  const [schoolUsed, setSchoolUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = situation.trim();
    if (!trimmed || trimmed.length < 20) return;

    setError("");
    setAnalysis("");
    setSources([]);
    setSchoolUsed(false);
    setLoading(true);

    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: trimmed,
          category: category || undefined,
          urgency: urgency || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'analyse");
        return;
      }

      setAnalysis(data.analysis);
      setSources(data.sources ?? []);
      setSchoolUsed(data.schoolContextUsed ?? false);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  const hasEnoughText = situation.trim().length >= 20;

  return (
    <div className="flex flex-col gap-6">
      {/* Intro */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/30 px-5 py-4 dark:border-indigo-900/30 dark:from-indigo-950/20 dark:to-blue-950/10">
        <div className="flex items-start gap-3">
          <Scale className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
              Décrivez votre situation. Recevez un plan d'action.
            </p>
            <p className="mt-1 text-xs text-indigo-600/70 dark:text-indigo-400/70">
              Analyse avec options, risques, recommandation et phrase prête à utiliser.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Situation */}
          <div>
            <label htmlFor="decision-situation" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Votre situation
            </label>
            <textarea
              id="decision-situation"
              rows={5}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Ex : Un parent furieux appelle pour contester le redoublement de son fils décidé hier par le conseil de classe. Il menace de saisir un avocat. Que dois-je faire ?"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          {/* Category + Urgency */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Catégorie (optionnel)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DecisionCategory | "")}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <option value="">Détection automatique</option>
                {Object.entries(DECISION_CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Urgence (optionnel)
              </label>
              <div className="flex gap-2">
                {Object.entries(DECISION_URGENCY_LABELS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setUrgency(urgency === k ? "" : k as DecisionUrgency)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
                      urgency === k
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                    )}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading || !hasEnoughText} className="self-start">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Scale className="mr-2 h-4 w-4" />
                Analyser et recommander
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* School context badge */}
      {analysis && schoolUsed && (
        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-50 px-3.5 py-2 dark:bg-blue-950/30">
          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
          </svg>
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Contexte de votre école pris en compte</span>
        </div>
      )}

      {/* Analysis result */}
      {analysis && <DecisionResult content={analysis} />}

      {/* Sources */}
      {sources.length > 0 && (
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
            <BookOpen className="h-4 w-4 text-zinc-400" />
            Textes consultés ({sources.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {sources.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {s.cda_code && (
                  <a
                    href={`https://www.gallilex.cfwb.be/document/pdf/${s.cda_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    CDA {s.cda_code} ↗
                  </a>
                )}
                <span className="text-xs text-zinc-400">{s.title.slice(0, 40)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// Decision Result — structured rendering
// ============================================================

const SECTION_STYLES: Record<string, { border: string; bg: string; iconColor: string }> = {
  cadrage: {
    border: "border-l-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  option: {
    border: "border-l-amber-500",
    bg: "bg-amber-50/30 dark:bg-amber-950/15",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  recommandation: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  vigilance: {
    border: "border-l-red-400",
    bg: "bg-red-50/30 dark:bg-red-950/15",
    iconColor: "text-red-500 dark:text-red-400",
  },
};

function getStyle(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("cadrage")) return SECTION_STYLES.cadrage;
  if (lower.includes("option")) return SECTION_STYLES.option;
  if (lower.includes("recommandation") || lower.includes("recommand")) return SECTION_STYLES.recommandation;
  if (lower.includes("vigilance") || lower.includes("attention")) return SECTION_STYLES.vigilance;
  return { border: "border-l-zinc-300", bg: "bg-zinc-50/30 dark:bg-zinc-800/20", iconColor: "text-zinc-400" };
}

function DecisionResult({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, i) => {
        const [titleLine, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();
        const style = getStyle(titleLine);
        const isRecommandation = titleLine.toLowerCase().includes("recommandation");

        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border border-l-[4px] p-5 sm:p-6",
              style.border,
              style.bg,
              isRecommandation
                ? "border-emerald-200 shadow-sm dark:border-emerald-900/50"
                : "border-zinc-100 dark:border-zinc-800/50"
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              {isRecommandation && <CheckCircle className={cn("h-5 w-5", style.iconColor)} />}
              <h3 className={cn("text-sm font-semibold", isRecommandation ? "text-emerald-800 dark:text-emerald-300" : "text-zinc-900 dark:text-white")}>
                {titleLine.trim()}
              </h3>
            </div>
            <MarkdownContent content={body} className={cn(
              isRecommandation ? "[&_p]:text-emerald-800 [&_strong]:text-emerald-900 dark:[&_p]:text-emerald-200" : ""
            )} />
          </div>
        );
      })}
    </div>
  );
}

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(CDA \d{4,6}|\[DOC-\d+\]|\[ÉCOLE[^\]]*\]|🟢|🟡|🔴)/g);
  return (
    <>
      {parts.map((part, i) => {
        const cdaMatch = part.match(/^CDA (\d{4,6})$/);
        if (cdaMatch) {
          return (
            <a key={i} href={`https://www.gallilex.cfwb.be/document/pdf/${cdaMatch[1]}`} target="_blank" rel="noopener noreferrer"
              className="mx-0.5 inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
              CDA {cdaMatch[1]} ↗
            </a>
          );
        }
        if (/^\[DOC-\d+\]$/.test(part)) {
          return <span key={i} className="mx-0.5 rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800">{part}</span>;
        }
        if (/^\[ÉCOLE/.test(part)) {
          return <span key={i} className="mx-0.5 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{part}</span>;
        }
        if (part === "🟢") return <span key={i} className="mx-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700">🟢 Faible</span>;
        if (part === "🟡") return <span key={i} className="mx-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700">🟡 Moyen</span>;
        if (part === "🔴") return <span key={i} className="mx-0.5 rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">🔴 Élevé</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
