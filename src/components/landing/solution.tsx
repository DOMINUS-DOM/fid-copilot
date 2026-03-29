"use client";

import { motion } from "framer-motion";
import { MessageSquare, Scale, BookOpen, GraduationCap, Building2 } from "lucide-react";

const modules = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Assistant juridique",
    description: "Réponses structurées fondées sur les décrets et le Code de l'enseignement en vigueur. Chaque citation est vérifiable.",
    color: "from-blue-500 to-blue-600",
    tag: "Examen · Terrain · Portfolio",
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Aide à la décision",
    description: "Décrivez une situation concrète. Recevez des options, une analyse des risques et une recommandation tranchée.",
    color: "from-indigo-500 to-indigo-600",
    tag: "Options · Risques · Plan d'action",
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Préparation FID",
    description: "Format aligné sur l'évaluation certificative. Auto-évaluation calibrée sur les barèmes réels.",
    color: "from-violet-500 to-violet-600",
    tag: "Objectif 16-18/20",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Portfolio professionnel",
    description: "Structurez votre réflexion sans que l'IA n'écrive à votre place. Guidage, pas substitution.",
    color: "from-emerald-500 to-emerald-600",
    tag: "Structurer · Améliorer · Challenger",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Contexte de votre école",
    description: "Uploadez votre ROI et vos documents internes. L'assistant les croise avec le cadre légal en vigueur.",
    color: "from-amber-500 to-amber-600",
    tag: "Loi > document interne — toujours",
  },
];

export function Solution() {
  return (
    <section id="fonctionnalites" className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Plateforme complète</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Un seul outil pour tout ce qui compte
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Juridique, décisionnel, FID et pilotage — toujours aligné sur les derniers textes.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-white`}>
                  {m.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{m.description}</p>
              <div className="mt-4 rounded-lg bg-slate-50 px-3 py-1.5">
                <p className="text-xs font-medium text-slate-400">{m.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
