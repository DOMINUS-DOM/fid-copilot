import Link from "next/link";

export function CTA() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-white">
          Ne perdez plus de temps à chercher dans les décrets
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Essayez FID Copilot gratuitement et prenez vos décisions en toute sécurité
          juridique, dès aujourd&apos;hui.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 active:bg-zinc-950 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Commencer gratuitement
        </Link>
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
          Aucune carte bancaire requise — accès immédiat
        </p>
      </div>
    </section>
  );
}
