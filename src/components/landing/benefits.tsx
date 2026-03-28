"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, FileSearch, Heart } from "lucide-react";

const benefits = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Gagnez du temps",
    description: "Réponse structurée en quelques secondes. Plus besoin de fouiller dans les décrets.",
    metric: "< 30 sec",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Sécurité juridique",
    description: "Chaque réponse est fondée sur les textes officiels. Vous savez sur quoi vous appuyer.",
    metric: "Sources",
  },
  {
    icon: <FileSearch className="h-6 w-6" />,
    title: "Accès aux textes officiels",
    description: "Liens directs vers les décrets et codes CDA. Vérifiez par vous-même en un clic.",
    metric: "30 textes",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Sérénité au quotidien",
    description: "Prenez vos décisions avec confiance. La base légale est là, claire et structurée.",
    metric: "Confiance",
  },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden bg-slate-900 px-6 py-24 sm:py-32">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Avantages
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Conçu pour le quotidien des directions d&apos;école
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Tout ce dont vous avez besoin pour prendre des décisions sûres et rapides.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 p-7 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-800/80"
            >
              {/* Top glow on hover */}
              <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-blue-500/0 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700/80 text-blue-400 ring-1 ring-slate-600/50">
                  {item.icon}
                </div>
                <span className="text-xl font-bold text-white">
                  {item.metric}
                </span>
              </div>
              <h3 className="relative mt-5 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
