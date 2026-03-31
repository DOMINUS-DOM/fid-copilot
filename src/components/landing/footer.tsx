import Link from "next/link";
import Image from "next/image";
import { type Messages, type Locale } from "@/lib/i18n/locales";

interface FooterProps {
  t: Messages["footer"];
  headerT: Messages["header"];
  locale: Locale;
}

export function Footer({ t, headerT, locale }: FooterProps) {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="FID Copilot" width={28} height={28} className="h-7 w-7" />
              <span className="text-base font-bold tracking-tight text-slate-900">
                FID <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Copilot</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">{t.tagline}</p>
            <p className="text-sm text-slate-500">{t.federation}</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-2 text-sm sm:items-start">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{t.navTitle}</span>
            <Link href={`/${locale}/guide`} className="text-slate-500 transition-colors hover:text-blue-600">{headerT.guide}</Link>
            <Link href={`/${locale}/pricing`} className="text-slate-500 transition-colors hover:text-blue-600">{headerT.pricing}</Link>
            <Link href={`/${locale}/europe`} className="text-slate-500 transition-colors hover:text-blue-600">{headerT.vision}</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{t.contactTitle}</span>
            <Link href="mailto:info@conceptus.be" className="text-slate-500 transition-colors hover:text-blue-600">
              info@conceptus.be
            </Link>
            <span className="text-slate-400">Conceptus BVA</span>
            <span className="text-slate-400">Brusselsesteenweg 292, 3090 Overijse</span>
            <span className="text-slate-400">BCE : BE 0693.879.107</span>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Conceptus BVA.
          </p>
        </div>
      </div>
    </footer>
  );
}
