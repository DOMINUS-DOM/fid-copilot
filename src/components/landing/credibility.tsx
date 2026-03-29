"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BookOpen, Quote, Database } from "lucide-react";

const guarantees = [
  { icon: <Quote className="h-5 w-5" />, text: "Chaque citation provient directement du texte officiel — jamais générée par l'IA" },
  { icon: <ShieldCheck className="h-5 w-5" />, text: "Si la référence exacte n'est pas disponible, l'assistant le signale clairement" },
  { icon: <BookOpen className="h-5 w-5" />, text: "Liens directs vers Gallilex pour vérification par vous-même" },
  { icon: <Database className="h-5 w-5" />, text: "Vos documents d'école ne remplacent jamais la loi — l'outil le signale automatiquement" },
];

export function Credibility() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Engagement</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Toujours à jour juridiquement
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            FID Copilot intègre les derniers décrets, circulaires et modifications du Code de l{"'"}enseignement. Vous travaillez toujours avec le cadre légal en vigueur — pas avec une version figée.
          </p>
        </motion.div>

        {/* Evolution badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-10 max-w-md rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Base juridique mise à jour en continu</p>
              <p className="mt-0.5 text-xs text-slate-500">Décrets, arrêtés, circulaires — intégrés dès leur publication</p>
            </div>
          </div>
        </motion.div>

        {/* Guarantees */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-xl bg-emerald-50/50 px-5 py-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                {g.icon}
              </div>
              <p className="text-sm leading-relaxed text-emerald-800">{g.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
