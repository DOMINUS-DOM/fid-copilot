"use client";

interface LegalRef {
  articleNumber: string;
  cdaCode: string;
  citationDisplay: string | null;
}

export function LegalReferences({ refs }: { refs: LegalRef[] }) {
  if (refs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-violet-200/80 bg-violet-50/30 p-4 sm:p-5 dark:border-violet-900/40 dark:bg-violet-950/10">
      <div className="mb-3 flex items-center gap-2">
        <svg
          className="h-4 w-4 text-violet-600 dark:text-violet-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
          Base juridique ({refs.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {refs.map((ref) => (
          <a
            key={`${ref.cdaCode}:${ref.articleNumber}`}
            href={`https://www.gallilex.cfwb.be/document/pdf/${ref.cdaCode}`}
            target="_blank"
            rel="noopener noreferrer"
            title={ref.citationDisplay ?? `Article ${ref.articleNumber} (CDA ${ref.cdaCode})`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:border-violet-700 dark:hover:bg-violet-900/30"
          >
            <span className="font-semibold">Art. {ref.articleNumber}</span>
            <span className="text-violet-400 dark:text-violet-600">|</span>
            <span className="text-violet-500 dark:text-violet-500">CDA {ref.cdaCode}</span>
            <svg
              className="h-3 w-3 text-violet-400 dark:text-violet-600"
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
    </div>
  );
}
