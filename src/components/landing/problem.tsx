const problems = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Des dizaines de textes à connaître",
    description:
      "Code de l'enseignement, Décret Missions, statut des directeurs, Pacte d'excellence... Trouver le bon article au bon moment relève du défi.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Des journées déjà surchargées",
    description:
      "Urgences, pilotage pédagogique, gestion d'équipe, parents... Le temps de rechercher la base légale d'une décision, vous ne l'avez pas.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "La peur de se tromper",
    description:
      "Une erreur d'interprétation juridique peut impacter un élève, un enseignant ou votre établissement. La responsabilité pèse sur vos épaules.",
  },
];

export function Problem() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          Le quotidien
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Chaque jour, vous prenez des décisions avec des enjeux juridiques réels
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Redoublement contesté, exclusion temporaire, obligation scolaire, gestion d&apos;un
          membre du personnel... Vous devez répondre vite, et bien.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800">
                {item.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
