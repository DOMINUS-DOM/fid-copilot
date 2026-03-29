"use client";

import { motion } from "framer-motion";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Trop de textes",
    description: "D&#x00e9;crets, codes, circulaires... Impossible de tout conna&#x00ee;tre par c&#x0153;ur.",
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
    title: "Risque d&#x2019;erreur",
    description: "Une mauvaise interpr&#x00e9;tation peut avoir des cons&#x00e9;quences r&#x00e9;elles.",
    color: "from-amber-500 to-amber-600",
  },
];

export function Problem() {
  return (
    <section className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — text + cards */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Diriger une &#x00e9;cole, c&#x2019;est d&#x00e9;cider vite.
                <br />
                <span className="text-slate-400">Souvent sans filet juridique.</span>
              </h2>
            </motion.div>

            <div className="mt-10 flex flex-col gap-4">
              {problems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-shadow hover:shadow-md hover:shadow-slate-100"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — human visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 shadow-lg">
              {/* Photo placeholder — replace src with actual photo */}
              {/* <Image src="/images/director-desk.jpg" alt="Directeur à son bureau" width={560} height={400} className="object-cover" /> */}
              <div className="flex aspect-[4/3] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-400">Photo : directeur au travail</span>
                </div>
              </div>
              {/* Floating stat badge */}
              <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                <p className="text-xs font-medium text-slate-500">En moyenne</p>
                <p className="text-lg font-bold text-slate-900">30+ <span className="text-sm font-normal text-slate-500">textes &#x00e0; ma&#x00ee;triser</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
