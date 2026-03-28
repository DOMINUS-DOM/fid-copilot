import Link from "next/link";

interface HeroProps {
  isAuthenticated?: boolean;
}

export function Hero({ isAuthenticated = false }: HeroProps) {
  return (
    <section className="flex flex-col items-center px-4 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
      <span className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
        Déjà utilisé par des directions en formation FID
      </span>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
        Prenez la bonne décision, avec la bonne base légale,{" "}
        <span className="text-zinc-500 dark:text-zinc-400">en moins de 30 secondes.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Vous êtes directeur ou directrice d&apos;école. Vous n&apos;avez pas le temps de
        fouiller les décrets. FID Copilot trouve la réponse juridique pour vous.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        {isAuthenticated ? (
          <Link
            href="/assistant"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Accéder à l&apos;assistant
          </Link>
        ) : (
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Commencer gratuitement
          </Link>
        )}
        <Link
          href="#demo"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-8 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Voir la démo
        </Link>
      </div>
      {!isAuthenticated && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
          2 semaines offertes — sans engagement — aucune carte bancaire requise
        </p>
      )}
    </section>
  );
}
