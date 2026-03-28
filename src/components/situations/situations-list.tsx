"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type AssistantSource,
  type ConfidenceLevel,
  CATEGORY_LABELS,
  CONFIDENCE_CONFIG,
} from "@/types";
import { SITUATIONS, type Situation } from "@/lib/situations";

export function SituationsList() {
  const [selected, setSelected] = useState<Situation | null>(null);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<AssistantSource[]>([]);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze(situation: Situation) {
    setSelected(situation);
    setError("");
    setAnswer("");
    setSources([]);
    setConfidence(null);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: situation.question }),
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
    <div className="flex flex-col gap-8">
      {/* Grille des situations */}
      <div className="grid gap-4 sm:grid-cols-2">
        {SITUATIONS.map((situation) => {
          const isActive = selected?.id === situation.id;
          return (
            <Card
              key={situation.id}
              className={`flex flex-col gap-3 transition-shadow ${
                isActive
                  ? "ring-2 ring-zinc-900 dark:ring-white"
                  : "hover:shadow-md"
              }`}
            >
              <div className="flex flex-wrap gap-1.5">
                {situation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {situation.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {situation.description}
              </p>
              <Button
                onClick={() => handleAnalyze(situation)}
                disabled={loading}
                variant={isActive && loading ? "secondary" : "primary"}
                className="mt-auto self-start text-xs"
              >
                {isActive && loading ? "Analyse en cours..." : "Analyser"}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Réponse */}
      {(answer || error || loading) && selected && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Analyse : {selected.title}
          </h2>

          {loading && !answer && (
            <Card>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Analyse en cours, cela peut prendre quelques secondes...
              </p>
            </Card>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {answer && (
            <Card>
              {confidence && (
                <div
                  className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${CONFIDENCE_CONFIG[confidence].bg}`}
                >
                  <svg
                    className={`h-4 w-4 ${CONFIDENCE_CONFIG[confidence].color}`}
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
                  <span
                    className={`text-xs font-medium ${CONFIDENCE_CONFIG[confidence].color}`}
                  >
                    Confiance : {CONFIDENCE_CONFIG[confidence].label}
                  </span>
                </div>
              )}
              <MarkdownResponse content={answer} />
            </Card>
          )}

          {sources.length > 0 && (
            <Card>
              <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                Sources consultées
              </h3>
              <ul className="flex flex-col gap-2">
                {sources.map((source, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
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
                    <span>
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
                      {source.cda_code && (
                        <span className="ml-1.5 inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          CDA {source.cda_code}
                        </span>
                      )}
                      <span className="ml-1.5 inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                        {CATEGORY_LABELS[source.category]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

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
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
