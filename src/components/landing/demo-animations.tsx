"use client";

import { motion } from "framer-motion";
import { HeroAnimationFID } from "@/components/landing/hero-animation";
import { HeroDocumentAnimation } from "@/components/landing/hero-document-animation";

export function DemoAnimations() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50/80 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            {"En action"}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {"Voyez FID Copilot en action"}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            {"De la question juridique au document officiel — tout se fait dans la plateforme."}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
              {"Assistant juridique"}
            </p>
            <HeroAnimationFID />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-violet-500">
              {"Générateur de documents"}
            </p>
            <HeroDocumentAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
