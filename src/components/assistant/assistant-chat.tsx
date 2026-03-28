"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type AssistantSource,
  type ConfidenceLevel,
  CATEGORY_LABELS,
  CONFIDENCE_CONFIG,
} from "@/types";

export function AssistantChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<AssistantSource[]>([]);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
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
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la requête");
        return;
      }

      setAnswer(data.answer);
      setSources(data.sources ?? []);
      setConfidence(data.confidence ?? null);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Formulaire */}
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            htmlFor="question"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Votre question juridique
          </label>
          <textarea
            id="question"
            rows={5}
            placeholder="Ex : Un enseignant refuse d'appliquer une décision du conseil de participation. En tant que directeur, quels sont vos leviers d'action ?"
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
              Cela peut prendre quelques secondes...
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

      {/* Confiance + Réponse */}
      {answer && (
        <Card>
          {confidence && <ConfidenceBadge level={confidence} />}
          <MarkdownResponse content={answer} />
        </Card>
      )}

      {/* Sources consultées */}
      {sources.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
            Sources consultées
          </h3>
          <ul className="flex flex-col gap-3">
            {sources.map((source, i) => (
              <li key={i} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2">
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
                    <span className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      CDA {source.cda_code}
                    </span>
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

/**
 * Badge de confiance affiché au-dessus de la réponse.
 */
function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = CONFIDENCE_CONFIG[level];
  return (
    <div className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${config.bg}`}>
      <svg className={`h-4 w-4 ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
      <span className={`text-xs font-medium ${config.color}`}>
        Confiance : {config.label}
      </span>
    </div>
  );
}

/**
 * Rendu basique du markdown (sections ## uniquement).
 */
function MarkdownResponse({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      {sections.map((section, i) => {
        const [title, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();

        return (
          <div key={i}>
            <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-white">
              {title.trim()}
            </h2>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
