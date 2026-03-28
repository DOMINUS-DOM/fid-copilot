import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-slate-900">FID Copilot</p>
            <p className="mt-1 text-sm text-slate-500">
              Assistant juridique pour directions d&apos;école
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Fédération Wallonie-Bruxelles
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
            <Link
              href="mailto:info@conceptus.be"
              className="text-slate-500 transition-colors hover:text-blue-600"
            >
              info@conceptus.be
            </Link>
            <span className="text-slate-400">Conceptus BVA</span>
            <span className="text-slate-400">Brusselsesteenweg 292, 3090 Overijse</span>
            <span className="text-slate-400">BCE : BE 0693.879.107</span>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Conceptus BVA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
