"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Quote, Scale, Upload, RefreshCw, Brain } from "lucide-react";

const benefits = [
  {
    icon: <Quote className="h-6 w-6" />,
    title: "Citations vérifiables",
    description: "Chaque référence provient directement du texte officiel. Lien CDA pour vérifier par vous-même.",
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: "Décision, pas opinion",
    description: "Options concrètes, risques identifiés, recommandation tranchée. Zéro formulation vague.",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Toujours à jour",
    description: "Base juridique enrichie en continu avec les derniers décrets, circulaires et modifications légales.",
  },
  {
    icon: <Upload className="h-6 w-6" />,
    title: "Votre école intégrée",
    description: "Uploadez votre ROI et vos documents. L'assistant les croise avec le cadre légal applicable.",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Auto-évaluation FID",
    description: "Score calibré sur les vrais barèmes certificatifs. Identification de vos axes de progrès.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Zéro hallucination",
    description: "Si la référence exacte n'est pas disponible, l'assistant le signale explicitement.",
  },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">Pourquoi FID Copilot</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            La fiabilité juridique avant tout
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/80 text-blue-400 ring-1 ring-slate-600/50">
                {item.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
