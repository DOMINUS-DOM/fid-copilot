"use client";

import { motion } from "framer-motion";
import { BookCheck, GraduationCap, Target } from "lucide-react";

const points = [
  {
    icon: <BookCheck className="h-6 w-6" />,
    title: "Textes officiels",
    description: "Base juridique compl&#x00e8;te, enrichie en continu avec les derniers d&#x00e9;crets et codes CDA.",
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Align&#x00e9; FID",
    description: "M&#x00ea;mes textes, m&#x00ea;me rigueur, m&#x00ea;me format que l&#x2019;&#x00e9;valuation certificative.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Actionnable",
    description: "Des &#x00e9;tapes concr&#x00e8;tes, pas de la th&#x00e9;orie. Pr&#x00ea;t &#x00e0; utiliser sur le terrain.",
  },
];

export function Credibility() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-12 lg:grid-cols-5">
          {/* Left — visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:col-span-2 lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
              {/* Photo placeholder — replace with actual photo */}
              {/* <Image src="/images/classroom.jpg" alt="Salle de classe" width={400} height={320} className="object-cover" /> */}
              <div className="flex aspect-[5/4] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  <span className="text-sm font-medium text-slate-400">Photo : environnement scolaire</span>
                </div>
              </div>
              {/* Trust badge */}
              <div className="absolute bottom-4 right-4 rounded-xl bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">Con&#x00e7;u en FWB</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Fiable. &#x00c9;volutif.<br className="hidden sm:block" /> Con&#x00e7;u pour le terrain.
              </h2>
            </motion.div>

            <div className="mt-10 flex flex-col gap-6">
              {points.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
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
        </div>
      </div>
    </section>
  );
}
