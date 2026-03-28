"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    num: "01",
    title: "Posez votre question",
    description: "Décrivez votre situation en langage courant. Pas besoin de connaître les références juridiques.",
    preview: "Un parent conteste le redoublement...",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    num: "02",
    title: "L&apos;IA analyse les textes",
    description: "FID Copilot croise votre question avec les textes officiels (décrets, codes CDA, circulaires).",
    preview: "CDA 49466, 21557, 31886...",
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    num: "03",
    title: "Réponse structurée et sourcée",
    description: "Vous recevez une analyse complète : problème, règle juridique, application concrète, conclusion.",
    preview: "5 sections, sources vérifiables",
  },
];

export function Solution() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Comment ça marche
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            La bonne réponse juridique en quelques secondes
          </h2>
        </motion.div>

        <div className="relative mt-20 grid gap-8 sm:grid-cols-3">
          {/* Connecting arrows between steps (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 z-0 hidden items-center justify-around sm:flex">
            <div className="w-1/3" />
            <ArrowRight className="h-5 w-5 text-blue-200" />
            <div className="w-1/6" />
            <ArrowRight className="h-5 w-5 text-blue-200" />
            <div className="w-1/3" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative z-10 flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-md ring-2 ring-blue-100">
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
              {/* Mini preview */}
              <div className="mt-4 w-full rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-400">{step.preview}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
