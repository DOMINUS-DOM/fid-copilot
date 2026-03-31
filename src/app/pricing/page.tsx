import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { APP_VERSION_LABEL } from "@/lib/version";

export const metadata = {
  title: "Tarifs | FID Copilot",
  description:
    "FID Copilot est gratuit pendant toute la phase bêta. Assistant juridique, aide à la décision, préparation FID et portfolio pour les directions d'école.",
};

const freeFeatures = [
  "Assistant juridique illimité (3 modes)",
  "Moteur d'aide à la décision",
  "Générateur de documents",
  "Vérification de conformité",
  "Citations exactes et vérifiables",
  "Upload de vos documents d'école",
  "Portfolio FID avec guidage IA",
  "Auto-évaluation calibrée /20",
  "Sources CDA avec liens Gallilex",
  "Base juridique mise à jour en continu",
  "Système de feedback intégré",
];

const proFeatures = [
  "Tout du plan Gratuit",
  "Partage en équipe",
  "Historique illimité",
  "Modèles personnalisés",
  "Export PDF des analyses",
  "Support prioritaire",
  "Tableaux de bord équipe",
  "Intégration agenda scolaire",
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
            {APP_VERSION_LABEL}
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {"Gratuit pendant la bêta"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            {"Pendant toute la phase de développement, FID Copilot est entièrement gratuit. Profitez de toutes les fonctionnalités sans aucune limite, et aidez-nous à construire l'outil idéal pour vous."}
          </p>
        </section>

        {/* Beta notice */}
        <section className="px-6 pt-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {"Accès complet et gratuit pour les testeurs bêta"}
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">
                    {"Vous êtes directeur ? Inscrivez-vous et utilisez FID Copilot sans aucun frais pendant toute la durée du développement. Vos retours nous aident à créer un outil sur mesure pour les directions d'école en Fédération Wallonie-Bruxelles."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            {/* Free plan (Beta) */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-8 shadow-lg shadow-emerald-50">
              <div className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {"Phase bêta"}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">{"Bêta — Gratuit"}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {"Toutes les fonctionnalités, sans limite"}
                </p>
              </div>

              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">{"0€"}</span>
                <span className="ml-1 text-sm text-slate-400">{"pendant toute la bêta"}</span>
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
                {isAuthenticated ? "Ouvrir l'application" : "Créer mon compte gratuit"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-slate-400">
                {"Aucune carte bancaire requise — Accès immédiat"}
              </p>
            </div>

            {/* Pro plan (coming after beta) */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-8">
              <div className="absolute right-4 top-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {"Après la bêta"}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {"Pour les équipes de direction"}
                </p>
              </div>

              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">{"—"}</span>
                <span className="ml-2 text-sm text-slate-400">{"prix à définir"}</span>
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
                {"Disponible après la bêta"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                {"Les testeurs bêta seront informés en priorité"}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="border-t border-slate-100 bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Questions fréquentes
            </h2>
            <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {"Combien de temps dure la phase bêta ?"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {"La bêta dure pendant toute la phase de développement. Vous serez prévenu avant tout changement de tarification, et les testeurs bêta bénéficieront d'un accès privilégié."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {"Mes données sont-elles sécurisées ?"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {"Absolument. Vos documents et conversations sont chiffrés et accessibles uniquement par vous."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {"Comment donner mon avis sur l'outil ?"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {"Depuis l'application, cliquez sur « Feedback » dans le menu. Vos remarques et suggestions sont envoyées directement à notre équipe."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {"Y a-t-il des limites pendant la bêta ?"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {"Non. Toutes les fonctionnalités sont accessibles sans aucune restriction. Utilisez l'outil autant que vous le souhaitez."}
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
