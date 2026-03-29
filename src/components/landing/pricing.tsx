"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Assistant juridique illimité",
  "Modes Examen, Terrain et Portfolio",
  "Base documentaire évolutive",
  "Sources officielles vérifiables",
  "Auto-évaluation FID intégrée",
  "Historique de vos questions",
];

export function Pricing() {
  return (
    <section className="bg-slate-50 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-md text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Commencez gratuitement
          </h2>
          <p className="mt-3 text-base text-slate-500">Accès complet, sans engagement.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100"
        >
          <p className="text-5xl font-bold text-slate-900">Gratuit</p>

          <ul className="mt-8 flex flex-col gap-3 text-left">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm text-slate-600">{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:brightness-110"
          >
            Essayer gratuitement
          </Link>
          <p className="mt-3 text-xs text-slate-400">Aucune carte bancaire requise</p>
        </motion.div>
      </div>
    </section>
  );
}
