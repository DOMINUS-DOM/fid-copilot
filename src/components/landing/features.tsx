"use client";

import { motion } from "framer-motion";
import { MessageSquare, Scale, BookOpen, GraduationCap, Building2 } from "lucide-react";
import { type Messages } from "@/lib/i18n/locales";

interface FeaturesProps {
  t: Messages["features"];
}

const icons = [MessageSquare, Scale, GraduationCap, BookOpen, Building2];
const colors = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
];

export function Features({ t }: FeaturesProps) {
  return (
    <section id="features" className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.label}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">{t.subtitle}</p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.modules.map((m, i) => {
            const Icon = icons[i] || MessageSquare;
            return (
              <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} whileHover={{ y: -3 }} className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors[i]} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{m.description}</p>
                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-1.5">
                  <p className="text-xs font-medium text-slate-400">{m.tag}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
