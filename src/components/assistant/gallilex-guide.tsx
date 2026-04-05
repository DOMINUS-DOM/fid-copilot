"use client";

import { useState } from "react";

interface GallilexGuideEntry {
  cdaCode: string;
  textTitle: string;
  url: string;
  articleNumber: string;
  paragraph: string | null;
  isPivot: boolean;
}

interface GallilexGuideData {
  entries: GallilexGuideEntry[];
  searchKeywords: string[];
  steps: string[];
  trap: string | null;
}

export function GallilexGuide({ guide }: { guide: GallilexGuideData }) {
  const [open, setOpen] = useState(false);

  if (guide.entries.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/10">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 sm:px-5"
      >
        <svg
          className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Comment retrouver cette réponse dans Gallilex ?
        </span>
        <svg
          className={`ml-auto h-4 w-4 shrink-0 text-emerald-500 transition-transform dark:text-emerald-500 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expandable content */}
      {open && (
        <div className="space-y-4 border-t border-emerald-200/60 px-4 py-4 dark:border-emerald-900/30 sm:px-5">
          {/* Texte(s) à ouvrir */}
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Texte à ouvrir
            </h4>
            {guide.entries.slice(0, 3).map((entry) => (
              <a
                key={`${entry.cdaCode}:${entry.articleNumber}`}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-2 text-sm text-emerald-800 hover:underline dark:text-emerald-300"
              >
                <span>
                  {entry.textTitle} (CDA {entry.cdaCode})
                </span>
                <svg
                  className="h-3 w-3 shrink-0 text-emerald-400 dark:text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            ))}
          </div>

          {/* Article(s) à vérifier */}
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Article à vérifier
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {guide.entries.slice(0, 3).map((entry) => (
                <span
                  key={`${entry.cdaCode}:${entry.articleNumber}`}
                  className="inline-flex items-center rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                  Art. {entry.articleNumber}
                  {entry.paragraph ? ` §${entry.paragraph}` : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Mots-clés */}
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Mots-clés (Ctrl+F)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {guide.searchKeywords.map((kw) => (
                <code
                  key={kw}
                  className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  {kw}
                </code>
              ))}
            </div>
          </div>

          {/* Étapes */}
          <div>
            <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Étapes
            </h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-emerald-800 dark:text-emerald-300">
              {guide.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Piège à éviter */}
          {guide.trap && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 dark:border-amber-900/40 dark:bg-amber-950/10">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
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
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {guide.trap}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
