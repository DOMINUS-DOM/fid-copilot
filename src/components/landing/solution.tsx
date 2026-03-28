const steps = [
  {
    number: "1",
    title: "Posez votre question",
    description:
      "Décrivez votre situation en langage courant. Pas besoin de connaître les références juridiques.",
  },
  {
    number: "2",
    title: "Recevez une réponse structurée",
    description:
      "Analyse, réponse argumentée, base légale et raisonnement — prêt à utiliser dans votre décision.",
  },
  {
    number: "3",
    title: "Vérifiez les sources officielles",
    description:
      "Chaque réponse cite les décrets et codes CDA utilisés, avec liens directs vers les textes.",
  },
];

export function Solution() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          Comment ça marche
        </p>
        <h2 className="mt-3 text-center text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          La bonne réponse juridique en 3 étapes
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                {step.number}
              </span>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm font-semibold tracking-wide text-zinc-900 dark:text-white">
          Simple. Rapide. Fiable.
        </p>
      </div>
    </section>
  );
}
