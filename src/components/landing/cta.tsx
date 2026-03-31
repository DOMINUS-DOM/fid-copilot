"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { APP_VERSION_LABEL } from "@/lib/version";

export function CTA() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-12 text-center shadow-2xl shadow-blue-500/20 sm:p-16"
      >
        {/* Subtle glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" />

        {/* Beta badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {APP_VERSION_LABEL} — Gratuit pour les testeurs
        </div>

        <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {"Testez, utilisez, donnez votre avis"}
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-base text-blue-100">
          {"Inscrivez-vous gratuitement et aidez-nous à construire l'outil idéal pour les directions d'école. Vos retours façonnent chaque prochaine version."}
        </p>

        <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
          >
            {"Créer mon compte gratuit"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="relative mt-5 text-sm text-blue-200">
          {"Gratuit pendant toute la phase bêta — Aucune carte bancaire"}
        </p>
      </motion.div>
    </section>
  );
}
