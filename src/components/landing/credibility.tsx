"use client";

import { motion } from "framer-motion";
import { BookCheck, GraduationCap, Target } from "lucide-react";

const points = [
  {
    icon: <BookCheck className="h-6 w-6" />,
    title: "Textes officiels",
    description: "Base juridique complète, enrichie en continu avec les derniers décrets et codes CDA.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Aligné FID",
    description: "Mêmes textes, même rigueur, même format que l&apos;évaluation certificative.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Actionnable",
    description: "Des étapes concrètes, pas de la théorie. Prêt à utiliser sur le terrain.",
  },
];

export function Credibility() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fiable. Évolutif. Conçu pour le terrain.
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {points.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                {item.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
