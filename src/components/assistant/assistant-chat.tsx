"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  type AssistantMode,
  type AssistantSource,
  type ConfidenceLevel,
  type GallilexHint,
  ASSISTANT_MODE_CONFIG,
  CATEGORY_LABELS,
  CONFIDENCE_CONFIG,
} from "@/types";

// ============================================================
// Section design system
// ============================================================

interface SectionStyle {
  icon: React.ReactNode;
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  label: string;
}

const SECTION_STYLES: Record<string, SectionStyle> = {
  "1": {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    border: "border-l-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Problème",
  },
  "2": {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    border: "border-l-violet-500",
    bg: "bg-violet-50/40 dark:bg-violet-950/20",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    label: "Droit",
  },
  "3": {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.58-3.13m0 0L12 8.79m-6.16 3.25L12 15.44M12 8.79V4.5m0 0l6.16 3.25M12 4.5L5.84 7.75M12 19.5v-4.06m6.16-3.25L12 8.79m6.16 3.4L12 15.44m6.16-3.25v4.06" />
      </svg>
    ),
    border: "border-l-amber-500",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Application",
  },
  "4": {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    label: "Conclusion",
  },
  "5": {
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    border: "border-l-slate-400 dark:border-l-slate-600",
    bg: "bg-slate-50/60 dark:bg-slate-800/30",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    label: "Posture",
  },
};

// ============================================================
// Main component
// ============================================================

export function AssistantChat() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<AssistantMode>("examen");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<AssistantSource[]>([]);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [gallilex, setGallilex] = useState<GallilexHint[]>([]);
  const [schoolContextUsed, setSchoolContextUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setError("");
    setAnswer("");
    setSources([]);
    setConfidence(null);
    setGallilex([]);
    setSchoolContextUsed(false);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la requête");
        return;
      }
      setAnswer(data.answer);
      setSources(data.sources ?? []);
      setConfidence(data.confidence ?? null);
      setGallilex(data.gallilex ?? []);
      setSchoolContextUsed(data.schoolContextUsed ?? false);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      {/* Mode selector */}
      <ModeSelector mode={mode} onChange={setMode} disabled={loading} />

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="question" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Votre question
          </label>
          <textarea
            id="question"
            rows={5}
            placeholder={
              mode === "portfolio"
                ? "Ex : J'ai mené un projet de différenciation pédagogique. Comment structurer cette expérience dans mon portfolio ?"
                : "Ex : Un parent conteste la décision de redoublement de son enfant. Quelle est la procédure ?"
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[120px] rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
          />
          <Button
            type="submit"
            disabled={loading || !question.trim()}
            className="h-12 w-full text-base sm:h-auto sm:w-auto sm:self-start sm:text-sm"
          >
            {loading ? "Analyse en cours..." : "Analyser"}
          </Button>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
              Recherche dans les textes de référence...
            </div>
          )}
        </form>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Confidence + school context badge */}
      {answer && (
        <div className="flex flex-wrap items-center gap-3">
          {confidence && (
            <ConfidenceBadge level={confidence} sourcesCount={sources.length} />
          )}
          {schoolContextUsed && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2 dark:bg-blue-950/30">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Contexte de votre école pris en compte
              </span>
            </div>
          )}
        </div>
      )}

      {/* Response */}
      {answer && <StructuredResponse content={answer} />}

      {/* Gallilex */}
      {gallilex.length > 0 && <GallilexFallback hints={gallilex} />}

      {/* Sources */}
      {sources.length > 0 && <SourcesPanel sources={sources} />}
    </div>
  );
}

// ============================================================
// Mode Selector
// ============================================================

function ModeSelector({ mode, onChange, disabled }: { mode: AssistantMode; onChange: (m: AssistantMode) => void; disabled: boolean }) {
  const modes: AssistantMode[] = ["examen", "terrain", "portfolio"];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        Mode de réponse
      </span>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => {
          const config = ASSISTANT_MODE_CONFIG[m];
          const isActive = mode === m;
          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => onChange(m)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-all disabled:opacity-50",
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              )}
            >
              <span className="text-sm font-medium">{config.label}</span>
              <span className={cn("hidden text-[11px] leading-tight sm:block", isActive ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-600")}>
                {config.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Confidence Badge
// ============================================================

function ConfidenceBadge({ level, sourcesCount }: { level: ConfidenceLevel; sourcesCount: number }) {
  const config = CONFIDENCE_CONFIG[level];
  return (
    <div className={`inline-flex items-center gap-2 self-start rounded-xl px-3.5 py-2 ${config.bg}`}>
      <svg className={`h-4 w-4 ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
      <span className={`text-xs font-medium ${config.color}`}>
        Confiance : {config.label} — {sourcesCount} source{sourcesCount > 1 ? "s" : ""} consultée{sourcesCount > 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ============================================================
// Gallilex Fallback
// ============================================================

function GallilexFallback({ hints }: { hints: GallilexHint[] }) {
  return (
    <Card className="border-amber-200 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Références à vérifier sur Gallilex</p>
          {hints.map((hint, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                {hint.cda_code ? (
                  <a href={`https://www.gallilex.cfwb.be/document/pdf/${hint.cda_code}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    {hint.text} (CDA {hint.cda_code}) ↗
                  </a>
                ) : (
                  <span className="text-xs text-amber-700 dark:text-amber-400">{hint.text}</span>
                )}
              </div>
              {hint.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-600">Mots-clés :</span>
                  {hint.keywords.map((kw) => (
                    <span key={kw} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="https://www.gallilex.cfwb.be/" target="_blank" rel="noopener noreferrer" className="self-start text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200">
            Ouvrir Gallilex ↗
          </a>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Sources Panel
// ============================================================

function SourcesPanel({ sources }: { sources: AssistantSource[] }) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
        Sources consultées ({sources.length})
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {sources.map((source, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
            <div className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-sm font-medium leading-snug">
                {source.source_url ? (
                  <a href={source.source_url} target="_blank" rel="noopener noreferrer" className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 hover:decoration-zinc-500 dark:decoration-zinc-600 dark:hover:text-white">{source.title}</a>
                ) : (
                  source.title
                )}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-6">
              {source.cda_code && (
                <a href={`https://www.gallilex.cfwb.be/document/pdf/${source.cda_code}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                  CDA {source.cda_code} ↗
                </a>
              )}
              <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                {CATEGORY_LABELS[source.category]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// Structured Response — V2 premium
// ============================================================

function StructuredResponse({ content }: { content: string }) {
  // Séparer le contenu principal de l'auto-évaluation FID
  const evalSplit = content.split(/^## (?:Évaluation FID|🧠 Évaluation FID|Evaluation FID)/m);
  const mainContent = evalSplit[0];
  const evalContent = evalSplit.length > 1 ? evalSplit[1] : null;

  const sections = mainContent.split(/^## /m).filter(Boolean);

  // Extraire la conclusion pour le résumé rapide
  const conclusionSection = sections.find((s) => {
    const title = s.split("\n")[0].trim();
    return title.match(/^4\./);
  });
  const quickSummary = conclusionSection
    ? conclusionSection
        .split("\n")
        .slice(1)
        .join(" ")
        .trim()
        .replace(/\*\*/g, "")
        .replace(/\[DOC-\d+\]/g, "")
        .replace(/CDA \d{4,6}/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200)
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Quick summary */}
      {quickSummary && quickSummary.length > 20 && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-emerald-50/30 px-5 py-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-emerald-950/10">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Résumé rapide</p>
            <div className="mt-1 [&_p]:text-sm [&_p]:font-medium [&_p]:text-emerald-800 dark:[&_p]:text-emerald-300 [&_strong]:text-emerald-900 dark:[&_strong]:text-emerald-200">
              <MarkdownContent content={quickSummary} />
            </div>
          </div>
        </div>
      )}

      {/* Main sections */}
      {sections.map((section, i) => {
        const [titleLine, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();
        const sectionNum = titleLine.trim().match(/^(\d)\./)?.[1] ?? "";
        const style = SECTION_STYLES[sectionNum];

        if (!style) {
          // Unknown section — render plain
          return (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">{titleLine.trim()}</h2>
              <MarkdownContent content={body} />
            </div>
          );
        }

        const isConclusion = sectionNum === "4";

        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border border-l-[4px] p-5 sm:p-6 transition-all",
              style.border,
              style.bg,
              isConclusion
                ? "border-emerald-200 shadow-sm shadow-emerald-100/50 dark:border-emerald-900/50 dark:shadow-none"
                : "border-zinc-100 dark:border-zinc-800/50"
            )}
          >
            {/* Header */}
            <div className="mb-3 flex items-center gap-2.5">
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", style.iconBg, style.iconColor)}>
                {style.icon}
              </span>
              <h2 className={cn("text-sm font-semibold", isConclusion ? "text-emerald-800 dark:text-emerald-300" : "text-zinc-900 dark:text-white")}>
                {titleLine.trim()}
              </h2>
              <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", style.iconBg, style.iconColor)}>
                {style.label}
              </span>
            </div>

            {/* Body */}
            <div>
              <MarkdownContent content={body} className={cn(
                isConclusion ? "[&_p]:text-emerald-800 [&_strong]:text-emerald-900 dark:[&_p]:text-emerald-200" : ""
              )} />
            </div>
          </div>
        );
      })}

      {/* FID Evaluation */}
      {evalContent && <FidEvaluation content={evalContent} />}
    </div>
  );
}

// ============================================================
// FID Evaluation — modern UI
// ============================================================

function FidEvaluation({ content }: { content: string }) {
  // Parse scores from table or text
  const scores: { label: string; score: number }[] = [];
  const scorePatterns = [
    { label: "Qualité juridique", regex: /qualit[ée]\s*juridique[^/\d]*(\d)/i },
    { label: "Application au cas", regex: /application[^/\d]*(\d)/i },
    { label: "Clarté et structure", regex: /clart[ée][^/\d]*(\d)/i },
    { label: "Posture de direction", regex: /posture[^/\d]*(\d)/i },
  ];

  for (const { label, regex } of scorePatterns) {
    const match = content.match(regex);
    if (match) {
      scores.push({ label, score: parseInt(match[1], 10) });
    }
  }

  const totalMatch = content.match(/(\d{1,2})\s*\/\s*20/);
  const total = totalMatch ? parseInt(totalMatch[1], 10) : scores.reduce((a, b) => a + b.score, 0);

  // Parse justification and improvement
  const justifMatch = content.match(/\*\*Justification[^*]*\*\*[:\s]*([^\n*]+(?:\n[^\n*#]+)*)/i);
  const justification = justifMatch ? justifMatch[1].trim() : null;

  const axeMatch = content.match(/\*\*Axe[^*]*\*\*[:\s]*([^\n*]+(?:\n[^\n*#]+)*)/i);
  const axe = axeMatch ? axeMatch[1].trim() : null;

  if (scores.length === 0 && !totalMatch) return null;

  const totalColor =
    total >= 16
      ? "text-emerald-600 dark:text-emerald-400"
      : total >= 12
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const totalBg =
    total >= 16
      ? "bg-emerald-50 dark:bg-emerald-950/30"
      : total >= 12
        ? "bg-amber-50 dark:bg-amber-950/30"
        : "bg-red-50 dark:bg-red-950/30";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Évaluation FID
        </h3>
        <div className={cn("flex items-center gap-1 rounded-xl px-3 py-1.5", totalBg)}>
          <span className={cn("text-xl font-bold", totalColor)}>{total}</span>
          <span className="text-xs font-medium text-zinc-400">/20</span>
        </div>
      </div>

      {/* Score bars */}
      {scores.length > 0 && (
        <div className="mt-4 grid gap-3">
          {scores.map(({ label, score }) => {
            const pct = (score / 5) * 100;
            const barColor =
              score >= 4
                ? "bg-emerald-500 dark:bg-emerald-400"
                : score >= 3
                  ? "bg-amber-500 dark:bg-amber-400"
                  : "bg-red-500 dark:bg-red-400";
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-36 text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className={cn("h-2 rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs font-bold text-zinc-700 dark:text-zinc-300">{score}/5</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Justification */}
      {justification && (
        <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Justification</p>
          <MarkdownContent content={justification} />
        </div>
      )}

      {/* Improvement axis */}
      {axe && (
        <div className="mt-3 rounded-xl bg-blue-50/50 px-4 py-3 dark:bg-blue-950/20">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Axe d'amélioration</p>
          <MarkdownContent content={axe} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// Highlighted Body (CDA + DOC references)
// ============================================================

function HighlightedBody({ text }: { text: string }) {
  const parts = text.split(/(CDA \d{4,6}|\[DOC-\d+\])/g);

  return (
    <>
      {parts.map((part, i) => {
        const cdaMatch = part.match(/^CDA (\d{4,6})$/);
        if (cdaMatch) {
          return (
            <a
              key={i}
              href={`https://www.gallilex.cfwb.be/document/pdf/${cdaMatch[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-0.5 inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              CDA {cdaMatch[1]} ↗
            </a>
          );
        }

        if (/^\[DOC-\d+\]$/.test(part)) {
          return (
            <span key={i} className="mx-0.5 inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
              {part}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
