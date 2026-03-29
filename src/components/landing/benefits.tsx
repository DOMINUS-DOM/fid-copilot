"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, RefreshCw, Heart } from "lucide-react";

const benefits = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Réponse immédiate",
    description: "Structurée et sourcée, en quelques secondes.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Fiabilité juridique",
    description: "Fondée sur les textes officiels. Vérifiable en un clic.",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Base évolutive",
    description: "Enrichie en continu avec les derniers textes et procédures.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Pensé pour vous",
    description: "Conçu avec des directions d&#x2019;école, pour le terrain réel.",
  },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Un outil qui évolue avec vous
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-400">
            Mises à jour régulières. Base documentaire enrichie en continu.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
