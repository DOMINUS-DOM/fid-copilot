"use client";

import { motion } from "framer-motion";
import { Users, ClipboardCheck, UserX, ArrowRight } from "lucide-react";

const cases = [
  {
    icon: <Users className="h-5 w-5" />,
    emoji: "👨‍👩‍👧",
    situation: "Un parent conteste une décision",
    question: "Comment gérer un recours contre un redoublement ?",
    result: "Procédure complète avec délais, textes applicables et phrase à utiliser face au parent.",
    tags: ["CDA 49466", "Recours", "Conseil de classe"],
  },
  {
    icon: <ClipboardCheck className="h-5 w-5" />,
    emoji: "📋",
    situation: "L&apos;inspection arrive",
    question: "Quelles sont mes obligations en matière de pilotage ?",
    result: "Cadre légal du plan de pilotage, contrat d&apos;objectifs, rôle du DCO et points de contrôle.",
    tags: ["CDA 45593", "Plan de pilotage", "DCO"],
  },
  {
    icon: <UserX className="h-5 w-5" />,
    emoji: "⚠️",
    situation: "Conflit avec un enseignant",
    question: "Quels sont mes leviers en cas d&apos;absences répétées ?",
    result: "Statut applicable, procédure disciplinaire, rôle du PO et étapes à suivre.",
    tags: ["CDA 31886", "Statut", "Discipline"],
  },
];

export function UseCases() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Cas concrets
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Des situations que vous vivez chaque semaine
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
            FID Copilot vous accompagne dans les situations les plus fréquentes et les plus sensibles.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {cases.map((item, i) => (
            <motion.div
              key={item.situation}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Header with emoji */}
              <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {item.situation}
                </h3>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                {/* Question */}
                <div className="rounded-lg bg-blue-50/60 px-4 py-3">
                  <p className="text-sm italic text-blue-800">
                    &laquo; {item.question} &raquo;
                  </p>
                </div>

                {/* Arrow */}
                <div className="my-3 flex justify-center">
                  <ArrowRight className="h-4 w-4 -rotate-90 text-slate-300" />
                </div>

                {/* Result */}
                <div className="flex-1 rounded-lg bg-emerald-50/60 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-700">FID Copilot répond :</p>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-600">
                    {item.result}
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
