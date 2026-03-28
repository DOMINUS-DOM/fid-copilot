"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-10 text-center shadow-2xl shadow-blue-500/20 sm:p-16"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ne perdez plus de temps à chercher dans les décrets
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-blue-100">
          Rejoignez les directeurs qui utilisent FID Copilot pour prendre
          des décisions sûres, rapidement, et avec la bonne base légale.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-blue-200">
          Aucune carte bancaire requise — Accès immédiat
        </p>
      </motion.div>
    </section>
  );
}
