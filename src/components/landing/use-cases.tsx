"use client";

import { motion } from "framer-motion";

const cases = [
  { emoji: "👨‍👩‍👧", label: "Recours", question: "Un parent conteste le redoublement. Quelle procédure ?" },
  { emoji: "🚨", label: "Exclusion", question: "Exclusion définitive : quelles étapes obligatoires ?" },
  { emoji: "📋", label: "Inspection", question: "L'inspection arrive. Quelles sont mes obligations ?" },
  { emoji: "⚖️", label: "Personnel", question: "Absences répétées d'un enseignant. Quels leviers ?" },
  { emoji: "📝", label: "Inscription", question: "Puis-je refuser une inscription en cours d'année ?" },
  { emoji: "🎓", label: "Responsabilité", question: "Élève blessé en voyage scolaire. Qui est responsable ?" },
  { emoji: "🏫", label: "Spécialisé", question: "Aménagements raisonnables : quelles obligations ?" },
  { emoji: "🌍", label: "DASPA", question: "Élève primo-arrivant : quelles démarches d'accueil ?" },
  { emoji: "📊", label: "Pilotage", question: "Plan de pilotage et contrat d'objectifs : comment articuler ?" },
];

export function UseCases() {
  return (
    <section className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Sur le terrain</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Chaque semaine, ces questions se posent
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-500">
            FID Copilot y répond avec la base légale en vigueur et un plan d'action concret.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-shadow hover:shadow-md hover:shadow-slate-100"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-700">{item.question}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
