"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

        <h2 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Prêt à diriger avec la bonne base légale ?
        </h2>
        <div className="relative mt-8">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
          >
            Essayer gratuitement
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="relative mt-5 text-sm text-blue-200">Gratuit — Aucune carte bancaire</p>
      </motion.div>
    </section>
  );
}
