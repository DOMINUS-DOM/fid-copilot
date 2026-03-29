"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, Lightbulb, GraduationCap, User } from "lucide-react";

export function Demo() {
  return (
    <section id="demo" className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            En action
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Voyez par vous-même
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-500">
            Une question concrète, une réponse structurée avec base légale et sources officielles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-xs font-medium text-slate-400">FID Copilot</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">Confiance : Élevée</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Question */}
              <div className="mb-8 rounded-xl bg-blue-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Question</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Un parent conteste la décision du conseil de classe de faire redoubler son enfant en 4e secondaire.
                  En tant que directeur, quelle est la procédure à suivre ?
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <DemoSection
                  icon={<Search className="h-4 w-4" />}
                  color="border-l-slate-400"
                  title="1. Identification du problème"
                  content="Un parent conteste une décision de maintien (redoublement) prise par le conseil de classe. Il s'agit d'un recours contre une décision d'échec scolaire en 4e secondaire. Les acteurs : le directeur, le conseil de classe, les parents, l'élève."
                />
                <DemoSection
                  icon={<BookOpen className="h-4 w-4" />}
                  color="border-l-blue-500"
                  title="2. Règle juridique"
                  content="Articles 96 à 102 du Code de l'enseignement (CDA 49466) — la procédure de recours comporte deux étapes : la conciliation interne auprès du chef d'établissement, puis le recours externe devant le Conseil de recours."
                  badge="CDA 49466"
                />
                <DemoSection
                  icon={<Lightbulb className="h-4 w-4" />}
                  color="border-l-amber-500"
                  title="3. Application concrète"
                  content="1) Réceptionner la demande écrite du parent dans les 2 jours ouvrables. 2) Réunir le conseil de classe pour réexamen. 3) Notifier la décision motivée. 4) En cas de refus, informer des voies de recours externe."
                />
                <DemoSection
                  icon={<GraduationCap className="h-4 w-4" />}
                  color="border-l-emerald-500"
                  title="4. Conclusion (format examen)"
                  content="Le directeur doit organiser la conciliation interne dans les délais légaux, réunir le conseil de classe, et notifier sa décision motivée par écrit au parent."
                />
                <DemoSection
                  icon={<User className="h-4 w-4" />}
                  color="border-l-violet-500"
                  title="5. Posture professionnelle"
                  content='Phrase terrain : "Je comprends votre inquiétude. La loi prévoit une procédure que nous allons suivre ensemble. Je réunis le conseil de classe pour réexaminer la situation."'
                />
              </div>

              {/* Sources */}
              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-700">Sources consultées (3)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    CDA 49466 ↗
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    CDA 21557 ↗
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    Incontournable commun
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DemoSection({
  icon,
  color,
  title,
  content,
  badge,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  content: string;
  badge?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-100 border-l-[3px] ${color} bg-white p-4`}>
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        {badge && (
          <span className="ml-auto rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{content}</p>
    </div>
  );
}
