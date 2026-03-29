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
        className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-10 text-center shadow-2xl shadow-blue-500/20 sm:p-14"
      >
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Prêt à diriger avec la bonne base légale ?
        </h2>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
          >
            Essayer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-blue-200">Gratuit — Aucune carte bancaire</p>
      </motion.div>
    </section>
  );
}
