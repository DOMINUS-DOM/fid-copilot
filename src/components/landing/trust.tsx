"use client";

import { motion } from "framer-motion";
import { Quote, ShieldCheck, RefreshCw, Upload } from "lucide-react";
import { type Messages } from "@/lib/i18n/locales";

interface TrustProps {
  t: Messages["trust"];
}

const trustIcons = [Quote, ShieldCheck, RefreshCw, Upload];

export function Trust({ t }: TrustProps) {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">{t.label}</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{t.title}</h2>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.points.map((item, i) => {
            const Icon = trustIcons[i] || Quote;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-blue-400 ring-1 ring-slate-600/50">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
