"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, MessageSquare, Scale, GraduationCap, BookOpen, Building2 } from "lucide-react";
import { APP_VERSION_LABEL } from "@/lib/version";

interface HeroProps {
  isAuthenticated?: boolean;
}

const highlights = [
  { icon: MessageSquare, text: "Assistant juridique" },
  { icon: Scale, text: "Aide à la décision" },
  { icon: GraduationCap, text: "Préparation FID" },
  { icon: BookOpen, text: "Portfolio" },
  { icon: Building2, text: "Documents école" },
];

export function Hero({ isAuthenticated = false }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/40">
      <div className="hero-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-glow-1 absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-200/50 blur-3xl" />
        <div className="hero-glow-2 absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="hero-glow-3 absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-indigo-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          {/* Beta badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              {APP_VERSION_LABEL} — Accès gratuit pour tous les directeurs
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
          >
            {"Votre assistant juridique IA, "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {"pensé pour les directions d'école"}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500"
          >
            {"FID Copilot vous aide à prendre des décisions fondées sur les textes légaux en vigueur en Fédération Wallonie-Bruxelles. Droit scolaire, aide à la décision, préparation FID, portfolio — tout est centralisé, sourcé et vérifiable."}
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {highlights.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {text}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href={isAuthenticated ? "/assistant" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              {isAuthenticated ? "Ouvrir l'application" : "Tester gratuitement"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
            >
              Voir les tarifs
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <Shield className="h-4 w-4 text-emerald-500" />
            {"Gratuit pendant toute la phase bêta — Aucune carte bancaire — Accès immédiat"}
          </motion.p>

          {/* Beta co-construction message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 max-w-xl rounded-2xl border border-blue-100 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-slate-600">
              {"Nous construisons FID Copilot "}
              <strong className="text-slate-900">avec vous</strong>
              {". En tant que testeur bêta, partagez vos remarques et vos besoins directement depuis l'application. Chaque retour nous aide à développer un outil "}
              <strong className="text-slate-900">sur mesure</strong>
              {" pour les directeurs."}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
