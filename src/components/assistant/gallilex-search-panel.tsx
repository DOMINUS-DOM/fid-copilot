"use client";

import type { GallilexSearchStrategy } from "@/lib/ai/gallilex-search";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  seuil: "Question de seuil / nombre",
  "procédure": "Question de procédure",
  "définition": "Question de définition",
  condition: "Question de condition / autorisation",
  droit: "Question de droit / obligation",
  "cas pratique": "Cas pratique",
};

const TEXT_TYPE_LABELS: Record<string, string> = {
  code: "Code",
  loi: "Loi",
  "décret": "Décret",
  "arrêté royal": "Arrêté royal",
  AGCF: "Arrêté du Gouvernement",
};

export function GallilexSearchPanel({
  strategy,
}: {
  strategy: GallilexSearchStrategy;
}) {
  return (
    <div className="space-y-5">
      {/* 1. Type de question */}
      <Section number={1} title="Type de question">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {QUESTION_TYPE_LABELS[strategy.questionType] ?? strategy.questionType}
        </p>
      </Section>

      {/* 2. Matière juridique */}
      <Section number={2} title="Matière juridique">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {strategy.legalMatter}
        </p>
      </Section>

      {/* 3. Texte à viser en priorité */}
      <Section number={3} title="Texte à viser en priorité">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              {TEXT_TYPE_LABELS[strategy.primaryText.textType] ?? strategy.primaryText.textType}
            </span>
            <a
              href={strategy.primaryText.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              {strategy.primaryText.shortTitle} (CDA {strategy.primaryText.cdaCode})
              <ExternalLinkIcon />
            </a>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {strategy.primaryText.rationale}
          </p>
        </div>
      </Section>

      {/* 4. Point d'entrée */}
      <Section number={4} title="Point d'entrée dans Gallilex">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {strategy.entryPoint}
        </p>
      </Section>

      {/* 5. Mots-clés Ctrl+F */}
      <Section number={5} title="Mots-clés efficaces (Ctrl+F)">
        <div className="flex flex-wrap gap-1.5">
          {strategy.searchKeywords.map((kw) => (
            <code
              key={kw}
              className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              {kw}
            </code>
          ))}
        </div>
      </Section>

      {/* 6. Stratégie de recherche */}
      <Section number={6} title="Stratégie de recherche">
        <ol className="list-inside list-decimal space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {strategy.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      {/* 7. Piège à éviter */}
      {strategy.trap && (
        <Section number={7} title="Piège à éviter">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 dark:border-amber-900/40 dark:bg-amber-950/10">
            <WarningIcon />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {strategy.trap}
            </p>
          </div>
        </Section>
      )}

      {/* 8. Signe de validation */}
      {strategy.confirmation && (
        <Section number={strategy.trap ? 8 : 7} title="Signe que vous êtes au bon endroit">
          <div className="flex items-start gap-2 rounded-xl border border-sky-200/80 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/10">
            <CheckIcon />
            <p className="text-xs text-sky-800 dark:text-sky-300">
              {strategy.confirmation}
            </p>
          </div>
        </Section>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {number}
        </span>
        {title}
      </h4>
      <div className="pl-7">{children}</div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="ml-1 inline h-3 w-3 text-emerald-400 dark:text-emerald-600"
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
  );
}

function WarningIcon() {
  return (
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
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
