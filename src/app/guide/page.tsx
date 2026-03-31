import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { APP_VERSION_LABEL } from "@/lib/version";
import {
  ArrowRight,
  UserPlus,
  LayoutGrid,
  FileText,
  Sparkles,
  MessageSquare,
  Scale,
  Zap,
  FileOutput,
  CheckCircle,
  Building2,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Guide | FID Copilot",
  description: "Apprenez à utiliser FID Copilot en 2 minutes. Guide de prise en main pour les directions d'école.",
};

const steps = [
  {
    num: "1",
    icon: UserPlus,
    title: "Créez votre compte",
    desc: "Inscription gratuite en 30 secondes. Aucune carte bancaire requise.",
    color: "from-blue-500 to-blue-600",
  },
  {
    num: "2",
    icon: LayoutGrid,
    title: "Choisissez un module",
    desc: "Assistant, Décision, Générateur, Vérification — selon votre besoin du moment.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    num: "3",
    icon: FileText,
    title: "Décrivez votre situation",
    desc: "Posez votre question en langage naturel ou collez un document à analyser.",
    color: "from-violet-500 to-violet-600",
  },
  {
    num: "4",
    icon: Sparkles,
    title: "Exploitez la réponse",
    desc: "Analyse structurée, citations sourcées, recommandation claire — prêt à agir.",
    color: "from-emerald-500 to-emerald-600",
  },
];

const modulesData = [
  { icon: MessageSquare, title: "Assistant", desc: "Analyse juridique structurée avec citations exactes", href: "/assistant", color: "from-blue-500 to-blue-600" },
  { icon: Scale, title: "Décision", desc: "Options, risques et recommandation pour chaque situation", href: "/decision", color: "from-indigo-500 to-indigo-600" },
  { icon: Zap, title: "Situations", desc: "Cas concrets prêts à analyser", href: "/situations", color: "from-violet-500 to-violet-600" },
  { icon: FileOutput, title: "Générateur", desc: "Courriers et documents sur base légale", href: "/generateur", color: "from-amber-500 to-amber-600" },
  { icon: CheckCircle, title: "Vérification", desc: "Conformité de vos documents et décisions", href: "/verification", color: "from-emerald-500 to-emerald-600" },
  { icon: Building2, title: "Mon école", desc: "Uploadez ROI et documents internes", href: "/mon-ecole", color: "from-rose-500 to-rose-600" },
  { icon: BookOpen, title: "Portfolio", desc: "Structurez votre réflexion FID", href: "/portfolio", color: "from-cyan-500 to-cyan-600" },
];

export default async function GuidePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-8 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            <BookOpen className="h-4 w-4" />
            Guide de prise en main
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {"Bien démarrer avec FID Copilot"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            {"Un assistant conçu pour accompagner les directions d'école dans leurs décisions juridiques et administratives. Prenez-le en main en 2 minutes."}
          </p>
          <div className="mt-8">
            <Link
              href={isAuthenticated ? "/assistant" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              {"Commencer maintenant"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* 4 étapes */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {"4 étapes pour commencer"}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.num} className="relative flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="mt-1 text-xs font-bold text-slate-300">{"Étape " + s.num}</span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {"Les modules à votre disposition"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">
              {"Chaque module répond à un besoin précis. Cliquez pour y accéder directement."}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modulesData.map((m) => (
                <Link
                  key={m.title}
                  href={isAuthenticated ? m.href : "/signup"}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-white`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">{m.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Beta message */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {"FID Copilot est en phase de test"}
                    </h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                      {APP_VERSION_LABEL}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {"Vos retours sont essentiels pour améliorer l'outil. Chaque remarque, chaque suggestion nous aide à construire la solution idéale pour les directions d'école. Les testeurs actifs bénéficieront d'avantages exclusifs sur les futures versions."}
                  </p>
                  <Link
                    href="/feedback"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
                  >
                    {"Donner mon avis"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
