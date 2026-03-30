"use client";

import { motion } from "framer-motion";
import { MessageSquare, Scale, BookOpen, GraduationCap, Building2 } from "lucide-react";

const modules = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Assistant juridique",
    description: "Posez votre question, recevez une analyse structurée avec citations exactes des textes en vigueur.",
    color: "from-blue-500 to-blue-600",
    tag: "Examen \u00b7 Terrain \u00b7 Portfolio",
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Aide \u00e0 la d\u00e9cision",
    description: "D\u00e9crivez une situation. Recevez les options, une analyse des risques et une recommandation tranch\u00e9e.",
    color: "from-indigo-500 to-indigo-600",
    tag: "Options \u00b7 Risques \u00b7 Plan d\u2019action",
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Pr\u00e9paration FID",
    description: "Format align\u00e9 sur l\u2019\u00e9valuation certificative. Auto-\u00e9valuation calibr\u00e9e sur les bar\u00e8mes r\u00e9els.",
    color: "from-violet-500 to-violet-600",
    tag: "Objectif 16-18/20",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Portfolio professionnel",
    description: "Structurez votre r\u00e9flexion sans que l\u2019IA n\u2019\u00e9crive \u00e0 votre place. Guidage, pas substitution.",
    color: "from-emerald-500 to-emerald-600",
    tag: "Structurer \u00b7 Am\u00e9liorer \u00b7 Challenger",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Contexte de votre \u00e9cole",
    description: "Uploadez votre ROI et vos documents internes. L\u2019assistant les croise avec le cadre l\u00e9gal.",
    color: "from-amber-500 to-amber-600",
    tag: "Loi > document interne",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Plateforme compl\u00e8te
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Un seul outil pour tout ce qui compte
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Juridique, d\u00e9cisionnel, FID et pilotage \u2014 toujours align\u00e9 sur les derniers textes.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-white`}
                >
                  {m.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                {m.description}
              </p>
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
