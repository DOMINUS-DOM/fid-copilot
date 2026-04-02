import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { APP_VERSION_LABEL } from "@/lib/version";
import { getMessages, isValidLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import {
  ArrowRight, UserPlus, LayoutGrid, FileText, Sparkles,
  MessageSquare, Scale, Zap, FileOutput, CheckCircle, Building2, BookOpen, MessageCircle,
} from "lucide-react";

const stepIcons = [UserPlus, LayoutGrid, FileText, Sparkles];
const moduleIcons = [MessageSquare, Scale, Zap, FileOutput, CheckCircle, Building2, BookOpen];
const moduleColors = [
  "from-blue-500 to-blue-600", "from-indigo-500 to-indigo-600", "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600", "from-emerald-500 to-emerald-600", "from-rose-500 to-rose-600", "from-cyan-500 to-cyan-600",
];
const stepColors = [
  "from-blue-500 to-blue-600", "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600", "from-emerald-500 to-emerald-600",
];

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const msgs = await getMessages(locale as Locale);
  const t = msgs.guide;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} locale={locale as Locale} t={msgs.header} />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-8 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            <BookOpen className="h-4 w-4" />{t.badge}
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">{t.subtitle}</p>
          <div className="mt-8">
            <Link href={isAuthenticated ? "/assistant" : "/signup"} className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
              {t.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.stepsTitle}</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.map((s, i) => {
                const Icon = stepIcons[i] || Sparkles;
                return (
                  <div key={i} className="relative flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stepColors[i]} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.modulesTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">{t.modulesSubtitle}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.modules.map((m, i) => {
                const Icon = moduleIcons[i] || MessageSquare;
                return (
                  <Link key={i} href={isAuthenticated ? "/assistant" : "/signup"} className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 hover:shadow-md">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${moduleColors[i]} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">{m.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{"L\u2019application en images"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">{"Aperçu des principaux écrans de FID Copilot."}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[
                { src: "/images/guide/dashboard.png", label: "Tableau de bord", desc: "Vue d\u2019ensemble de votre activité, accès rapide aux modules et prochaines étapes." },
                { src: "/images/guide/assistant.png", label: "Assistant juridique", desc: "Posez une question et recevez une analyse structurée avec base légale." },
                { src: "/images/guide/decision.png", label: "Aide à la décision", desc: "Décrivez votre situation et obtenez des options avec risques et recommandations." },
                { src: "/images/guide/generateur.png", label: "Générateur de documents", desc: "Créez courriers, convocations et réponses formelles avec le bon cadre légal." },
                { src: "/images/guide/verification.png", label: "Vérification de conformité", desc: "Contrôlez la conformité juridique de vos documents avant envoi." },
              ].map((item, i) => (
                <div key={i} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{t.betaTitle}</h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">{APP_VERSION_LABEL}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.betaText}</p>
                  <Link href="/feedback" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110">
                    {t.feedbackCta}<ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer t={msgs.footer} headerT={msgs.header} locale={locale as Locale} />
    </div>
  );
}
