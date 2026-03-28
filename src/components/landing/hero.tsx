"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

interface HeroProps {
  isAuthenticated?: boolean;
}

export function Hero({ isAuthenticated = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/40">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Assistant juridique FID propulsé par l&apos;IA
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            La bonne décision juridique,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              en quelques secondes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Posez votre question. Obtenez une réponse structurée, fondée sur les textes
            officiels. Conçu pour les directions d&apos;école en FWB et la formation FID.
          </motion.p>

          {/* CTAs */}
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
              {isAuthenticated ? "Ouvrir l\u2019application" : "Commencer gratuitement"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Voir une démo
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex items-center gap-2 text-sm text-slate-500"
          >
            <Shield className="h-4 w-4 text-emerald-500" />
            Aucune carte bancaire requise — Accès immédiat
          </motion.p>

          {/* App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 w-full max-w-4xl"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-1 shadow-2xl shadow-slate-200/50">
              {/* Browser bar */}
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
              {/* Simulated app content */}
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    Mode Examen
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                    Terrain
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                    Portfolio
                  </span>
                </div>
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Un parent conteste la décision de redoublement. Quelle est la procédure ?
                </div>
                <div className="space-y-3">
                  <MockSection color="border-l-slate-400" num="1" title="Identification du problème" text="Contestation d&apos;une décision de redoublement par un parent..." />
                  <MockSection color="border-l-blue-500" num="2" title="Règle juridique" text="Article 96 du Code de l&apos;enseignement (CDA 49466) — procédure de recours interne et externe..." />
                  <MockSection color="border-l-amber-500" num="3" title="Application concrète" text="Le directeur doit convoquer le conseil de classe, notifier la décision motivée..." />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700">Confiance : Élevée — 3 sources consultées</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MockSection({ color, num, title, text }: { color: string; num: string; title: string; text: string }) {
  return (
    <div className={`rounded-lg border-l-[3px] ${color} border border-slate-100 bg-white p-3`}>
      <p className="text-xs font-semibold text-slate-700">{num}. {title}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}
