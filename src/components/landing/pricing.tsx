import Link from "next/link";

export function Pricing() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          Offre de lancement
        </p>
        <h2 className="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Essayez gratuitement pendant 2 semaines
        </h2>
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-4xl font-bold text-zinc-900 dark:text-white">Gratuit</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Accès complet, sans engagement
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-left text-sm text-zinc-600 dark:text-zinc-400">
            {[
              "Assistant juridique illimité",
              "Situations de terrain prêtes à l'emploi",
              "Réponses structurées avec base légale",
              "Sources officielles vérifiables (CDA, décrets)",
              "Historique complet de vos questions",
              "Annulation à tout moment",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Commencer gratuitement
          </Link>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
            Aucune carte bancaire requise — accès immédiat
          </p>
        </div>
      </div>
    </section>
  );
}
