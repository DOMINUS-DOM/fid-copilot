"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, CheckCircle } from "lucide-react";

const steps = [
  { icon: <MessageSquare className="h-5 w-5" />, title: "Posez votre question", sub: "En langage courant" },
  { icon: <Cpu className="h-5 w-5" />, title: "Analyse automatique", sub: "Textes officiels et jurisprudence" },
  { icon: <CheckCircle className="h-5 w-5" />, title: "Réponse structurée", sub: "Sourcée et actionnable" },
];

export function Solution() {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Simple</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            La bonne réponse en 3 étapes
          </h2>
        </motion.div>

        <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex flex-1 flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                {step.icon}
                <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow ring-2 ring-blue-100">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{step.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
