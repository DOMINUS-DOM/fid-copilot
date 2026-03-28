"use client";

import { motion } from "framer-motion";
import { BookCheck, GraduationCap, Target } from "lucide-react";

const points = [
  {
    icon: <BookCheck className="h-6 w-6" />,
    title: "Basé sur les textes officiels",
    description: "30 textes légaux intégrés : Code de l&apos;enseignement, Décret Missions, statut des directeurs, et tous les incontournables FID.",
    stat: "30",
    statLabel: "textes intégrés",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Aligné avec la formation FID",
    description: "Conçu pour préparer l&apos;évaluation certificative : mêmes textes, même logique, même exigence de justification juridique.",
    stat: "3",
    statLabel: "modes d&apos;assistance",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Pensé pour le terrain",
    description: "Pas de théorie abstraite. Des réponses actionnables avec les étapes concrètes, les personnes à contacter et les délais à respecter.",
    stat: "5",
    statLabel: "sections par réponse",
  },
];

export function Credibility() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Fiabilité
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Un outil que vous pouvez utiliser en confiance
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {points.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              {/* Stat circle */}
              <div className="relative flex h-24 w-24 items-center justify-center">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-violet-100" />
                <div className="absolute inset-[3px] rounded-full bg-white" />
                <div className="relative flex flex-col items-center">
                  <span className="text-2xl font-bold text-blue-600">{item.stat}</span>
                  <span className="text-[10px] font-medium text-slate-400">{item.statLabel}</span>
                </div>
              </div>

              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
