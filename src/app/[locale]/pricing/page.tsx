import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { getMessages, isValidLocale, type Locale } from "@/lib/i18n/locales";
import { APP_VERSION_LABEL } from "@/lib/version";
import { notFound } from "next/navigation";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const msgs = await getMessages(locale as Locale);
  const t = msgs.pricing;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} locale={locale as Locale} t={msgs.header} />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-4 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            {APP_VERSION_LABEL}
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">{t.subtitle}</p>
        </section>

        <section className="px-6 pt-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{t.betaNoticeTitle}</p>
                  <p className="mt-1 text-sm text-emerald-700">{t.betaNoticeText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-8 shadow-lg shadow-emerald-50">
              <div className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{t.badge}</div>
              <h3 className="text-lg font-semibold text-slate-900">{t.freeTitle}</h3>
              <p className="mt-1 text-sm text-slate-500">{t.freeSubtitle}</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">{t.freePrice}</span>
                <span className="ml-1 text-sm text-slate-400">{t.freePeriod}</span>
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {t.freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:brightness-110">
                {isAuthenticated ? t.freeCtaAuth : t.freeCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-slate-400">{t.freeNote}</p>
            </div>

            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-8">
              <div className="absolute right-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{t.proBadge}</div>
              <h3 className="text-lg font-semibold text-slate-900">{t.proTitle}</h3>
              <p className="mt-1 text-sm text-slate-500">{t.proSubtitle}</p>
              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">{"—"}</span>
                <span className="ml-2 text-sm text-slate-400">{t.proPrice}</span>
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {t.proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
              <button disabled className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-400">
                {t.proCta}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">{t.proNote}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t.faqTitle}</h2>
            <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
              {t.faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-sm font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer t={msgs.footer} headerT={msgs.header} locale={locale as Locale} />
    </div>
  );
}
