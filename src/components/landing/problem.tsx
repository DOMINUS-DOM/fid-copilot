"use client";

import { motion } from "framer-motion";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Des dizaines de textes à maîtriser",
    description:
      "Code de l&apos;enseignement, Décret Missions, statut des directeurs, Pacte d&apos;excellence... Trouver le bon article au bon moment relève du défi.",
    color: "from-blue-500 to-blue-600",
    stat: "30+",
    statLabel: "textes légaux",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Des journées déjà surchargées",
    description:
      "Urgences, pilotage pédagogique, gestion d&apos;équipe, parents... Le temps de chercher la base légale d&apos;une décision, vous ne l&apos;avez pas.",
    color: "from-violet-500 to-violet-600",
    stat: "0",
    statLabel: "minute à perdre",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "La peur de se tromper",
    description:
      "Une erreur d&apos;interprétation peut impacter un élève, un enseignant ou votre établissement. La responsabilité pèse sur vos épaules.",
    color: "from-amber-500 to-amber-600",
    stat: "100%",
    statLabel: "de responsabilité",
  },
];

export function Problem() {
  return (
    <section className="relative bg-white px-6 py-24 sm:py-32">
      {/* Decorative element — stacked documents visual */}
      <div className="pointer-events-none absolute right-0 top-12 hidden opacity-[0.04] lg:block">
        <div className="flex flex-col gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-slate-900"
              style={{ width: `${220 - i * 25}px`, marginLeft: `${i * 12}px` }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Le quotidien
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Vous êtes directeur. Vous n&apos;avez pas le temps de{" "}
            <br className="hidden sm:block" />
            chercher dans 300 pages de décrets.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500">
            Redoublement contesté, exclusion temporaire, obligation scolaire, gestion du personnel...
            Chaque jour, des décisions avec des enjeux juridiques réels.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-shadow hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Glow on hover */}
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${item.color} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`} />

              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                  {item.icon}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{item.stat}</p>
                  <p className="text-xs text-slate-400">{item.statLabel}</p>
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
