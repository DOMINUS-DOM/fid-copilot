"use client";

import { motion } from "framer-motion";
import { HeroDocumentAnimation } from "@/components/landing/hero-document-animation";
import { type Messages } from "@/lib/i18n/locales";

interface DemoDocumentProps {
  t: Messages["demoDocument"];
}

export function DemoDocument({ t }: DemoDocumentProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-500">{t.sectionLabel}</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.sectionTitle}</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <HeroDocumentAnimation t={t} />
        </motion.div>
      </div>
    </section>
  );
}
