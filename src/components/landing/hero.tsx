"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

interface HeroProps {
  isAuthenticated?: boolean;
}

export function Hero({ isAuthenticated = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Propulsé par l&apos;IA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
          >
            Votre assistant juridique{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              pour diriger en confiance
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500"
          >
            Posez votre question. Obtenez une réponse structurée, fondée sur les textes officiels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href={isAuthenticated ? "/assistant" : "/signup"}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110"
            >
              {isAuthenticated ? "Ouvrir l\u2019application" : "Essayer gratuitement"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
              Voir la démo
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4 text-emerald-500" />
            Gratuit — Aucune carte bancaire
          </motion.p>

          {/* Hero visual — product + human context */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mt-16 w-full max-w-4xl"
          >
            {/* Image placeholder for human visual */}
            <div className="absolute -left-8 -top-8 hidden lg:block">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-blue-100 to-violet-100 shadow-xl">
                {/* Replace with: <Image src="/images/hero-director.jpg" alt="Directeur" fill className="object-cover" /> */}
                <div className="flex h-full w-full items-center justify-center text-3xl">🎓</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-1 shadow-2xl shadow-slate-200/50">
              <div className="flex items-center gap-2 rounded-t-xl bg-slate-50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate-400">
                  app.fidcopilot.be/assistant
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">Examen</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-400">Terrain</span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-400">Portfolio</span>
                </div>
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Un parent conteste le redoublement. Quelle procédure ?
                </div>
                <div className="space-y-2.5">
                  <MockSection color="border-l-blue-500" bg="bg-blue-50/30" label="Problème" text="Recours contre une décision du conseil de classe..." />
                  <MockSection color="border-l-violet-500" bg="bg-violet-50/30" label="Règle juridique" text="Code de l&apos;enseignement (CDA 49466) — Art. 96 à 102" />
                  <MockSection color="border-l-emerald-500" bg="bg-emerald-50/40" label="Conclusion" text="La conciliation interne est obligatoire. Le directeur doit notifier par écrit." />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700">Confiance élevée — 3 sources</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MockSection({ color, bg, label, text }: { color: string; bg: string; label: string; text: string }) {
  return (
    <div className={`rounded-xl border-l-[3px] ${color} ${bg} px-4 py-2.5`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-xs text-slate-600">{text}</p>
    </div>
  );
}
