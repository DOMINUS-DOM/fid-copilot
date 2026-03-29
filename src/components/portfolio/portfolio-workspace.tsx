"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  type PortfolioAction,
  type PortfolioContext,
  PORTFOLIO_ACTION_CONFIG,
  PORTFOLIO_CONTEXT_CONFIG,
} from "@/types";

// ============================================================
// Icons
// ============================================================

const ACTION_ICONS: Record<PortfolioAction, React.ReactNode> = {
  structurer: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
  ameliorer: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  challenger: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
};

// ============================================================
// Section heading colors for response cards
// ============================================================

const SECTION_COLORS: Record<string, string> = {
  "points forts": "border-l-emerald-500 dark:border-l-emerald-400",
  "structure proposée": "border-l-blue-500 dark:border-l-blue-400",
  "suggestions": "border-l-amber-500 dark:border-l-amber-400",
  "questions réflexives": "border-l-violet-500 dark:border-l-violet-400",
  "ce qui ressort": "border-l-blue-500 dark:border-l-blue-400",
  "piste": "border-l-emerald-500 dark:border-l-emerald-400",
  "clarté": "border-l-zinc-400 dark:border-l-zinc-500",
  "lien": "border-l-violet-500 dark:border-l-violet-400",
  "ce que ton texte": "border-l-amber-500 dark:border-l-amber-400",
  "défi": "border-l-rose-500 dark:border-l-rose-400",
  "responsabilités": "border-l-indigo-500 dark:border-l-indigo-400",
};

function getSectionColor(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, color] of Object.entries(SECTION_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "border-l-zinc-300 dark:border-l-zinc-700";
}

// ============================================================
// Main component
// ============================================================

export function PortfolioWorkspace() {
  const [text, setText] = useState("");
  const [context, setContext] = useState<PortfolioContext>("situation");
  const [answer, setAnswer] = useState("");
  const [activeAction, setActiveAction] = useState<PortfolioAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAction(action: PortfolioAction) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError("");
    setAnswer("");
    setActiveAction(action);
    setLoading(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, action, context }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la requête");
        return;
      }

      setAnswer(data.answer);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  const hasText = text.trim().length >= 20;

  return (
    <div className="flex flex-col gap-6">
      {/* Intro */}
      <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Cet outil vous accompagne dans la construction de votre portfolio FID.
          Il ne rédige jamais à votre place — il vous aide à structurer, améliorer et approfondir votre réflexion.
        </p>
      </div>

      {/* Context selector */}
      <ContextSelector context={context} onChange={setContext} disabled={loading} />

      {/* 2-column layout on large screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Editor */}
        <div className="flex flex-col gap-4">
          <Card>
            <label
              htmlFor="portfolio-text"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Votre texte
            </label>
            <textarea
              id="portfolio-text"
              rows={14}
              placeholder={CONTEXT_PLACEHOLDERS[context]}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 text-base leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
            />
            {text.length > 0 && text.trim().length < 20 && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Écrivez au moins quelques phrases pour obtenir un retour utile.
              </p>
            )}
          </Card>

          {/* Action buttons */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(PORTFOLIO_ACTION_CONFIG) as PortfolioAction[]).map(
              (action) => {
                const config = PORTFOLIO_ACTION_CONFIG[action];
                const isActive = loading && activeAction === action;
                return (
                  <button
                    key={action}
                    type="button"
                    disabled={loading || !hasText}
                    onClick={() => handleAction(action)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-3 text-left transition-colors disabled:opacity-50",
                      isActive
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-white dark:text-zinc-900" : "text-zinc-400 dark:text-zinc-500")}>
                      {ACTION_ICONS[action]}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium">
                        {isActive ? "Analyse en cours..." : config.label}
                      </span>
                      <span
                        className={cn(
                          "block text-[11px] leading-tight",
                          isActive
                            ? "text-zinc-300 dark:text-zinc-500"
                            : "text-zinc-400 dark:text-zinc-600"
                        )}
                      >
                        {config.description}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* RIGHT: Suggestions */}
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {loading && !answer && (
            <Card className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Analyse de votre texte...
                </span>
              </div>
            </Card>
          )}

          {answer && (
            <>
              {activeAction && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 dark:bg-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {ACTION_ICONS[activeAction]}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {PORTFOLIO_ACTION_CONFIG[activeAction].label}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                    {PORTFOLIO_CONTEXT_CONFIG[context].short}
                  </span>
                </div>
              )}
              <PortfolioResponse content={answer} />
            </>
          )}

          {!answer && !loading && !error && (
            <Card className="flex items-center justify-center py-12 lg:min-h-[300px]">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg
                  className="h-8 w-8 text-zinc-300 dark:text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="text-sm text-zinc-400 dark:text-zinc-600">
                  Choisissez un contexte, rédigez votre texte, puis lancez une action.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Context Selector
// ============================================================

const CONTEXT_PLACEHOLDERS: Record<PortfolioContext, string> = {
  posture: "Décrivez votre réflexion sur votre posture de direction : votre style, vos valeurs, comment vous incarnez le rôle...",
  module: "Décrivez le module suivi, ce que vous en retenez, ce qui a changé dans votre pratique...",
  situation: "Racontez une situation concrète vécue sur le terrain : le contexte, ce qui s'est passé, ce que vous avez fait...",
  autoevaluation: "Évaluez vos compétences actuelles : vos forces, vos axes de progression, vos objectifs...",
  ecrit: "Collez ou rédigez ici votre écrit portfolio en cours de préparation...",
};

function ContextSelector({
  context,
  onChange,
  disabled,
}: {
  context: PortfolioContext;
  onChange: (c: PortfolioContext) => void;
  disabled: boolean;
}) {
  const contexts: PortfolioContext[] = ["posture", "module", "situation", "autoevaluation", "ecrit"];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
        Je travaille sur
      </span>
      <div className="flex flex-wrap gap-2">
        {contexts.map((c) => {
          const config = PORTFOLIO_CONTEXT_CONFIG[c];
          const isActive = context === c;
          return (
            <button
              key={c}
              type="button"
              disabled={disabled}
              onClick={() => onChange(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                isActive
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Structured response
// ============================================================

function PortfolioResponse({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean);

  if (sections.length <= 1) {
    return (
      <Card>
        <MarkdownContent content={content} />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const [titleLine, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();
        const borderColor = getSectionColor(titleLine);

        return (
          <div
            key={i}
            className={`rounded-lg border border-zinc-200 border-l-[3px] bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 ${borderColor}`}
          >
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {titleLine.trim()}
            </h3>
            <MarkdownContent content={body} />
          </div>
        );
      })}
    </div>
  );
}
