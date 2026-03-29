"use client";

import { motion } from "framer-motion";

const cases = [
  {
    emoji: "👨‍👩‍👧",
    situation: "Recours parental",
    question: "Comment gérer un recours contre un redoublement ?",
  },
  {
    emoji: "📋",
    situation: "Inspection",
    question: "Quelles sont mes obligations pour le plan de pilotage ?",
  },
  {
    emoji: "⚖️",
    situation: "Conflit RH",
    question: "Quels leviers face aux absences répétées d&apos;un enseignant ?",
  },
  {
    emoji: "🚨",
    situation: "Exclusion",
    question: "Quelle procédure pour une exclusion définitive ?",
  },
  {
    emoji: "📝",
    situation: "Inscription",
    question: "Puis-je refuser une inscription en cours d&apos;année ?",
  },
  {
    emoji: "🎓",
    situation: "Examen FID",
    question: "Un élève est blessé lors d&apos;une activité facultative. Responsabilité ?",
  },
];

export function UseCases() {
  return (
    <section className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Sur le terrain</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Les questions que vous vous posez chaque semaine
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item, i) => (
            <motion.div
              key={item.situation}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-shadow hover:shadow-md hover:shadow-slate-100"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.situation}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-700">{item.question}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
