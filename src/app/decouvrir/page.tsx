import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { APP_VERSION_LABEL } from "@/lib/version";
import {
  ArrowRight,
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  Scale,
  FileOutput,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Award,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Découvrir FID Copilot | Assistant juridique pour directions d'école",
  description: "FID Copilot aide les directions d'école à prendre des décisions sécurisées, rédiger des documents et gagner du temps. Essayez gratuitement.",
};

const problems = [
  { icon: AlertTriangle, title: "Situations juridiques complexes", desc: "Des dizaines de textes à croiser pour chaque décision" },
  { icon: Clock, title: "Manque de temps", desc: "Des heures perdues à chercher la bonne référence légale" },
  { icon: Shield, title: "Risque d'erreur", desc: "Une décision mal fondée peut être contestée ou annulée" },
];

const solutions = [
  { icon: MessageSquare, title: "Analyser une situation", desc: "Posez votre question, recevez une analyse structurée avec les articles de loi applicables", color: "from-blue-500 to-blue-600" },
  { icon: Scale, title: "Sécuriser vos décisions", desc: "Options concrètes, risques identifiés, recommandation tranchée — vous décidez en confiance", color: "from-indigo-500 to-indigo-600" },
  { icon: FileOutput, title: "Générer des documents fiables", desc: "Courriers, notes, réponses officielles — rédigés sur une base légale vérifiable", color: "from-violet-500 to-violet-600" },
  { icon: CheckCircle, title: "Vérifier la conformité", desc: "Soumettez un document ou une décision, l'outil vérifie sa conformité légale", color: "from-emerald-500 to-emerald-600" },
];

const useCases = [
  { emoji: "👨‍👩‍👦", title: "Contestation d'un parent", desc: "Recours contre un refus d'inscription ou un maintien — analyse des droits et procédures" },
  { emoji: "⚖️", title: "Décision disciplinaire", desc: "Exclusion, mesure conservatoire — respect de la procédure légale pas à pas" },
  { emoji: "👩‍🏫", title: "Absence d'un enseignant", desc: "Droits du personnel, obligations statutaires, démarches administratives" },
  { emoji: "✉️", title: "Rédaction de courrier", desc: "Réponse officielle à un parent, notification, convocation — sur base légale" },
];

const benefits = [
  { icon: Clock, title: "Gain de temps", desc: "Réponse en quelques secondes au lieu de plusieurs heures de recherche" },
  { icon: Shield, title: "Sécurité juridique", desc: "Chaque citation est sourcée et vérifiable via les textes officiels" },
  { icon: TrendingUp, title: "Clarté des décisions", desc: "Analyse structurée : problème, règle, application, conclusion" },
  { icon: Award, title: "Professionnalisation", desc: "Préparation FID, portfolio, auto-évaluation calibrée" },
];

export default async function DecouvrirPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  const ctaHref = isAuthenticated ? "/assistant" : "/signup";
  const ctaLabel = isAuthenticated ? "Ouvrir l'application" : "Essayer gratuitement";

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-violet-50/30 px-6 pb-16 pt-20 sm:pb-24 sm:pt-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute -right-40 top-20 h-[300px] w-[300px] rounded-full bg-violet-200/30 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {APP_VERSION_LABEL}
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {"L'assistant juridique des "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {"directions d'école"}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
              {"Prenez des décisions sécurisées, rédigez vos documents et gagnez du temps. Fondé sur les textes légaux en vigueur en Fédération Wallonie-Bruxelles."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
              >
                {"Comment ça marche ?"}
              </Link>
            </div>
          </div>
        </section>

        {/* Problème */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {"Les défis quotidiens des directions"}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {problems.map((p) => (
                <div key={p.title} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <span className="block text-center text-sm font-semibold uppercase tracking-widest text-blue-600">La solution</span>
            <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {"FID Copilot vous aide à"}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {solutions.map((s) => (
                <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cas d'usage */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {"Des situations que vous connaissez"}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {useCases.map((uc) => (
                <div key={uc.title} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">{uc.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{uc.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{uc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bénéfices */}
        <section className="relative overflow-hidden bg-slate-900 px-6 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -right-40 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {"Ce que vous y gagnez"}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-blue-400 ring-1 ring-slate-600/50">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{b.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-10 text-center shadow-2xl shadow-blue-500/20 sm:p-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {"Prêt à essayer ?"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-blue-100">
              {"Gratuit pendant toute la phase bêta. Aucune carte bancaire. Vos retours façonnent chaque nouvelle version."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
              >
                {isAuthenticated ? "Ouvrir l'application" : "Créer mon compte gratuit"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-blue-200">{"Gratuit — Aucune carte bancaire — Accès immédiat"}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
