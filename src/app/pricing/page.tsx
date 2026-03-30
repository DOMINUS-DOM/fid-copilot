import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Tarifs | FID Copilot",
  description:
    "Acc\u00e9dez \u00e0 toutes les fonctionnalit\u00e9s de FID Copilot gratuitement. Assistant juridique, aide \u00e0 la d\u00e9cision, pr\u00e9paration FID et portfolio.",
};

const freeFeatures = [
  "Assistant juridique illimit\u00e9 (3 modes)",
  "Moteur d\u2019aide \u00e0 la d\u00e9cision",
  "G\u00e9n\u00e9rateur de documents",
  "V\u00e9rification de conformit\u00e9",
  "Citations exactes et v\u00e9rifiables",
  "Upload de vos documents d\u2019\u00e9cole",
  "Portfolio FID avec guidage IA",
  "Auto-\u00e9valuation calibr\u00e9e /20",
  "Sources CDA avec liens Gallilex",
  "Base juridique mise \u00e0 jour en continu",
];

const proFeatures = [
  "Tout du plan Gratuit",
  "Partage en \u00e9quipe",
  "Historique illimit\u00e9",
  "Mod\u00e8les personnalis\u00e9s",
  "Export PDF des analyses",
  "Support prioritaire",
  "Tableaux de bord \u00e9quipe",
  "Int\u00e9gration agenda scolaire",
];

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-50 to-white px-6 pb-4 pt-20 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Tarification transparente
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Choisissez votre plan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Commencez gratuitement avec toutes les fonctionnalit\u00e9s essentielles.
            Passez au Pro quand votre \u00e9quipe grandit.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            {/* Free plan */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Gratuit</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Pour d\u00e9couvrir et utiliser au quotidien
                </p>
              </div>

              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">0\u20ac</span>
                <span className="ml-1 text-sm text-slate-400">/mois</span>
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:brightness-110"
              >
                {isAuthenticated ? "Ouvrir l\u2019application" : "Commencer gratuitement"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-slate-400">
                Aucune carte bancaire requise
              </p>
            </div>

            {/* Pro plan (coming soon) */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-8">
              <div className="absolute right-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Bient\u00f4t
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Pour les \u00e9quipes de direction
                </p>
              </div>

              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">\u2014</span>
                <span className="ml-2 text-sm text-slate-400">prix \u00e0 venir</span>
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-400"
              >
                Bient\u00f4t disponible
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Soyez inform\u00e9 du lancement
              </p>
            </div>
          </div>
        </section>

        {/* FAQ-like section */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Questions fr\u00e9quentes
            </h2>
            <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Le plan gratuit est-il vraiment illimit\u00e9 ?
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Oui. Toutes les fonctionnalit\u00e9s principales sont accessibles sans limite de temps ni de nombre de requ\u00eates.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Absolument. Vos documents et conversations sont chiffr\u00e9s et accessibles uniquement par vous.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Quand le plan Pro sera-t-il disponible ?
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Nous travaillons sur les fonctionnalit\u00e9s \u00e9quipe. Inscrivez-vous pour \u00eatre inform\u00e9 du lancement.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Puis-je annuler \u00e0 tout moment ?
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Le plan gratuit ne n\u00e9cessite aucun engagement. Pour le Pro, vous pourrez annuler \u00e0 tout moment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
