import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-10 dark:border-zinc-800">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">FID Copilot</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Assistant juridique pour directions d&apos;école
            </p>
          </div>
          <div className="text-center text-xs leading-relaxed text-zinc-400 sm:text-right dark:text-zinc-600">
            <p>
              Édité par{" "}
              <span className="font-medium text-zinc-500 dark:text-zinc-500">Conceptus BVA</span>
            </p>
            <p>Brusselsesteenweg 292, 3090 Overijse, Belgique</p>
            <p>BCE : BE 0693.879.107</p>
            <p>
              <Link href="mailto:info@conceptus.be" className="hover:underline">
                info@conceptus.be
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-100 pt-4 text-center dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} Conceptus BVA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
