"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
// Icônes et couleurs par section
// ============================================================

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "1": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  "2": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  "3": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.58-3.13m0 0L12 8.79m-6.16 3.25L12 15.44M12 8.79V4.5m0 0l6.16 3.25M12 4.5L5.84 7.75M12 19.5v-4.06m6.16-3.25L12 8.79m6.16 3.4L12 15.44m6.16-3.25v4.06" />
    </svg>
  ),
  "4": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  "5": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

const SECTION_COLORS: Record<string, string> = {
  "1": "border-l-zinc-400 dark:border-l-zinc-600",
  "2": "border-l-blue-500 dark:border-l-blue-400",
  "3": "border-l-amber-500 dark:border-l-amber-400",
  "4": "border-l-emerald-500 dark:border-l-emerald-400",
  "5": "border-l-violet-500 dark:border-l-violet-400",
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
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Mode selector */}
      <ModeSelector mode={mode} onChange={setMode} disabled={loading} />

      {/* Formulaire */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            htmlFor="question"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
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
            className="min-h-[120px] rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
          />
          <Button
            type="submit"
            disabled={loading || !question.trim()}
            className="h-12 w-full text-base sm:h-auto sm:w-auto sm:self-start sm:text-sm"
          >
            {loading ? "Analyse en cours..." : "Analyser"}
          </Button>
          {loading && (
            <span className="text-center text-xs text-zinc-500 sm:text-left dark:text-zinc-400">
              Recherche dans les textes de référence...
            </span>
          )}
        </form>
      </Card>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Confiance */}
      {answer && confidence && (
        <ConfidenceBadge level={confidence} sourcesCount={sources.length} />
      )}

      {/* Réponse structurée */}
      {answer && <StructuredResponse content={answer} />}

      {/* Gallilex hints */}
      {gallilex.length > 0 && <GallilexFallback hints={gallilex} />}

      {/* Sources consultées */}
      {sources.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Sources consultées ({sources.length})
          </h3>
          <ul className="flex flex-col gap-3">
            {sources.map((source, i) => (
              <li
                key={i}
                className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2"
              >
                <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="leading-relaxed">
                    {source.source_url ? (
                      <a
                        href={source.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 hover:decoration-zinc-500 dark:decoration-zinc-600 dark:hover:text-white dark:hover:decoration-zinc-400"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6 sm:pl-0">
                  {source.cda_code && (
                    <a
                      href={`https://www.gallilex.cfwb.be/document/pdf/${source.cda_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      CDA {source.cda_code} ↗
                    </a>
                  )}
                  <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                    {CATEGORY_LABELS[source.category]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// Mode Selector
// ============================================================

function ModeSelector({
  mode,
  onChange,
  disabled,
}: {
  mode: AssistantMode;
  onChange: (m: AssistantMode) => void;
  disabled: boolean;
}) {
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
                "flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-center transition-colors disabled:opacity-50",
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              )}
            >
              <span className="text-sm font-medium">{config.label}</span>
              <span
                className={cn(
                  "hidden text-[11px] leading-tight sm:block",
                  isActive
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-zinc-400 dark:text-zinc-600"
                )}
              >
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

function ConfidenceBadge({
  level,
  sourcesCount,
}: {
  level: ConfidenceLevel;
  sourcesCount: number;
}) {
  const config = CONFIDENCE_CONFIG[level];
  return (
    <div
      className={`inline-flex items-center gap-2 self-start rounded-lg px-3 py-1.5 ${config.bg}`}
    >
      <svg
        className={`h-4 w-4 ${config.color}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
      <span className={`text-xs font-medium ${config.color}`}>
        Confiance : {config.label} — {sourcesCount} source
        {sourcesCount > 1 ? "s" : ""} consultée{sourcesCount > 1 ? "s" : ""}
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
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Références à vérifier sur Gallilex
          </p>
          {hints.map((hint, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                {hint.cda_code ? (
                  <a
                    href={`https://www.gallilex.cfwb.be/document/pdf/${hint.cda_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                  >
                    {hint.text} (CDA {hint.cda_code}) ↗
                  </a>
                ) : (
                  <span className="text-xs text-amber-700 dark:text-amber-400">
                    {hint.text}
                  </span>
                )}
              </div>
              {hint.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-600">
                    Mots-clés :
                  </span>
                  {hint.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="https://www.gallilex.cfwb.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            Ouvrir Gallilex ↗
          </a>
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Structured Response
// ============================================================

function StructuredResponse({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const [titleLine, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();

        const sectionNum = titleLine.trim().match(/^(\d)\./)?.[1] ?? "";
        const borderColor =
          SECTION_COLORS[sectionNum] ?? "border-l-zinc-300 dark:border-l-zinc-700";
        const icon = SECTION_ICONS[sectionNum] ?? null;

        return (
          <div
            key={i}
            className={`rounded-lg border border-zinc-200 border-l-[3px] bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 ${borderColor}`}
          >
            <div className="mb-2 flex items-center gap-2">
              {icon && (
                <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
              )}
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {titleLine.trim()}
              </h2>
            </div>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
              <HighlightedBody text={body} />
            </div>
          </div>
        );
      })}
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
              className="mx-0.5 inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              CDA {cdaMatch[1]} ↗
            </a>
          );
        }

        if (/^\[DOC-\d+\]$/.test(part)) {
          return (
            <span
              key={i}
              className="mx-0.5 inline-flex items-center rounded bg-zinc-100 px-1 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
            >
              {part}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
