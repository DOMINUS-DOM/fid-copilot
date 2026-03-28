import { Card } from "@/components/ui/card";
import { type Document, CATEGORY_LABELS } from "@/types";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      {/* En-tête : badges */}
      <div className="flex flex-wrap items-center gap-2">
        {document.is_core && (
          <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            Incontournable
          </span>
        )}
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {CATEGORY_LABELS[document.category]}
        </span>
        {document.cda_code && (
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            CDA {document.cda_code}
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-white">
        {document.title}
      </h3>

      {/* Résumé */}
      {document.summary && (
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {document.summary}
        </p>
      )}

      {/* Lien source */}
      {document.source_url && (
        <a
          href={document.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100 sm:border-0 sm:px-0 sm:py-0 dark:border-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-white sm:dark:border-0 sm:dark:hover:bg-transparent"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Voir le texte source
        </a>
      )}
    </Card>
  );
}
