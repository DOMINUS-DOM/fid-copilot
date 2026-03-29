"use client";

import { motion } from "framer-motion";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Trop de textes",
    description: "Décrets, codes, circulaires... Impossible de tout connaître par coeur.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Pas le temps",
    description: "Votre agenda est plein. La recherche juridique ne peut pas attendre.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Risque d&apos;erreur",
    description: "Une mauvaise interprétation peut avoir des conséquences réelles.",
    color: "from-amber-500 to-amber-600",
  },
];

export function Problem() {
  return (
    <section className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Diriger une école, c&apos;est décider vite.
            <br />
            <span className="text-slate-400">Souvent sans filet juridique.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition-shadow hover:shadow-lg hover:shadow-slate-100"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
