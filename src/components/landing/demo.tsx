export function Demo() {
  return (
    <section
      id="demo"
      className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          En action
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Voici un exemple réel de réponse
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Un directeur pose une question concrète. FID Copilot lui répond avec la base légale,
          le raisonnement et les sources officielles.
        </p>

        {/* Bloc démo simulé */}
        <div className="mt-12 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {/* Barre titre */}
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs text-zinc-400">FID Copilot — Assistant</span>
          </div>

          <div className="flex flex-col gap-6 p-4 sm:p-8">
            {/* Question */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Question
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                Un parent conteste la décision du conseil de classe de faire redoubler son enfant.
                En tant que directeur, quelle est la procédure à suivre ?
              </p>
            </div>

            {/* Réponse simulée */}
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Analyse du problème",
                  body: "La contestation d'une décision de redoublement soulève la question du droit de recours des parents et des obligations du directeur...",
                },
                {
                  title: "Réponse",
                  body: "Le directeur doit informer les parents de la procédure de conciliation interne, puis orienter vers le conseil de recours si nécessaire...",
                },
                {
                  title: "Base légale",
                  body: "Code de l'enseignement (CDA 49466) — Décret Missions du 24 juillet 1997 (CDA 21557)",
                },
                {
                  title: "Raisonnement",
                  body: "Le Code de l'enseignement prévoit une procédure de recours en deux étapes : conciliation interne puis recours externe...",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {section.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Confiance */}
            <div className="inline-flex items-center gap-2 self-start rounded-lg bg-emerald-50 px-3 py-1.5 dark:bg-emerald-900/20">
              <svg className="h-4 w-4 text-emerald-700 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Confiance : Élevée — 3 sources consultées
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
