export function TrialBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
      <svg
        className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
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
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium">Essai gratuit en cours</span>
        <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">—</span>
        Profitez de toutes les fonctionnalités pendant votre période de test.
      </p>
    </div>
  );
}
