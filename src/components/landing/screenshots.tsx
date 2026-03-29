"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Scale,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Building2,
} from "lucide-react";

// ============================================================
// Product screenshots — simulated app screens
// ============================================================

const screens = [
  {
    title: "Assistant juridique",
    subtitle: "Citations exactes et vérifiables",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "from-blue-500 to-blue-600",
    floatClass: "float-1",
    content: (
      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">Examen</span>
          <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[10px] text-slate-400">Terrain</span>
          <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[10px] text-slate-400">Portfolio</span>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          Un parent conteste le redoublement...
        </div>
        <div className="rounded-lg border-l-2 border-l-blue-500 bg-blue-50/40 px-3 py-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Règle juridique</p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Article 96 du Code de l'enseignement (<span className="rounded bg-blue-100 px-1 text-[9px] font-semibold text-blue-700">CDA 49466</span>)
          </p>
        </div>
        <div className="rounded-lg border-l-2 border-l-emerald-500 bg-emerald-50/40 px-3 py-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Conclusion</p>
          <p className="mt-0.5 text-[10px] font-medium text-emerald-700">La conciliation interne est obligatoire.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-medium text-emerald-700">Confiance élevée — 3 sources</span>
        </div>
      </div>
    ),
  },
  {
    title: "Aide à la décision",
    subtitle: "Options, risques et plan d'action",
    icon: <Scale className="h-4 w-4" />,
    color: "from-indigo-500 to-indigo-600",
    floatClass: "float-2",
    content: (
      <div className="space-y-2">
        <div className="rounded-lg bg-indigo-50/50 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">Cadrage</p>
          <p className="mt-0.5 text-[10px] text-slate-600">Recours parental contre une décision du conseil de classe.</p>
        </div>
        <div className="rounded-lg border border-slate-100 px-3 py-2">
          <p className="text-[10px] font-semibold text-slate-700">Option A : Conciliation immédiate</p>
          <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">Risque faible</span>
        </div>
        <div className="rounded-lg border border-slate-100 px-3 py-2">
          <p className="text-[10px] font-semibold text-slate-700">Option B : Maintien de la décision</p>
          <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">Risque moyen</span>
        </div>
        <div className="rounded-lg border-l-2 border-l-emerald-500 bg-emerald-50/50 px-3 py-2">
          <p className="text-[9px] font-bold text-emerald-700">Recommandation : Option A</p>
          <p className="mt-0.5 text-[10px] text-emerald-600">Plan d'action en 3 étapes...</p>
        </div>
      </div>
    ),
  },
  {
    title: "Générateur",
    subtitle: "Courriers et documents professionnels",
    icon: <Sparkles className="h-4 w-4" />,
    color: "from-violet-500 to-violet-600",
    floatClass: "float-3",
    content: (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-medium text-violet-700">Convocation</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">Réponse recours</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">Note interne</span>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 font-mono text-[10px] leading-relaxed text-slate-600">
          <p className="text-slate-400">[NOM DE L'ÉCOLE]</p>
          <p className="text-slate-400">[DATE]</p>
          <p className="mt-1.5 font-semibold text-slate-700">Objet : Convocation entretien</p>
          <p className="mt-1">Madame, Monsieur,</p>
          <p className="mt-0.5">Suite à la situation signalée le...</p>
        </div>
        <div className="flex gap-1.5">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-500">Ton : Formel</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-500">Courrier</span>
        </div>
      </div>
    ),
  },
];

const secondRow = [
  {
    title: "Vérification",
    subtitle: "Conformité de vos documents",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "from-amber-500 to-amber-600",
    content: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">CONFORME</span>
          <span className="text-[10px] text-slate-500">Diagnostic global</span>
        </div>
        <div className="rounded border-l-2 border-l-emerald-400 bg-emerald-50/30 px-2 py-1 text-[10px] text-emerald-700">Points conformes : 4</div>
        <div className="rounded border-l-2 border-l-amber-400 bg-amber-50/30 px-2 py-1 text-[10px] text-amber-700">Points sensibles : 1</div>
        <div className="rounded border-l-2 border-l-blue-400 bg-blue-50/30 px-2 py-1 text-[10px] text-blue-700">Utilisable après correction</div>
      </div>
    ),
  },
  {
    title: "Portfolio FID",
    subtitle: "Structurer sans écrire à votre place",
    icon: <BookOpen className="h-4 w-4" />,
    color: "from-emerald-500 to-emerald-600",
    content: (
      <div className="space-y-1.5">
        <div className="flex gap-1">
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">Structurer</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-400">Améliorer</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-400">Challenger</span>
        </div>
        <div className="rounded bg-emerald-50/50 px-2 py-1.5 text-[10px] text-emerald-700">
          Plan proposé : 1) Contexte 2) Situation 3) Analyse 4) Actions 5) Recul réflexif
        </div>
        <div className="rounded bg-violet-50/50 px-2 py-1.5 text-[10px] italic text-violet-600">
          Question : Qu'est-ce que cette situation révèle de votre posture ?
        </div>
      </div>
    ),
  },
  {
    title: "Mon école",
    subtitle: "Vos documents intégrés",
    icon: <Building2 className="h-4 w-4" />,
    color: "from-orange-500 to-orange-600",
    content: (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600">ROI 2024-2025</span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">Actif</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600">Règlement des études</span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">Actif</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600">Projet d'établissement</span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-medium text-blue-700">12 sections</span>
        </div>
        <div className="rounded bg-blue-50/50 px-2 py-1 text-[9px] text-blue-600">
          Contexte école intégré dans les réponses
        </div>
      </div>
    ),
  },
];

// ============================================================
// Component
// ============================================================

export function Screenshots() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const parallaxValues = [y1, y2, y3];

  return (
    <section ref={containerRef} className="overflow-hidden bg-gradient-to-b from-slate-50 to-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            La plateforme
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tout ce dont un directeur a besoin
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            6 modules conçus pour le quotidien des directions d'école.
          </p>
        </motion.div>

        {/* Main 3 screens with parallax */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {screens.map((screen, i) => (
            <motion.div
              key={screen.title}
              style={{ y: parallaxValues[i] }}
              className={screen.floatClass}
            >
              <ScreenCard {...screen} delay={i * 0.1} />
            </motion.div>
          ))}
        </div>

        {/* Secondary 3 screens */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {secondRow.map((screen, i) => (
            <motion.div
              key={screen.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ScreenCard {...screen} delay={0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Screen card
// ============================================================

function ScreenCard({
  title,
  subtitle,
  icon,
  color,
  content,
  delay,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  content: React.ReactNode;
  delay: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40 transition-shadow hover:shadow-xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br ${color} text-white`}>
            <span className="scale-75">{icon}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-700">{title}</span>
          <span className="text-[10px] text-slate-400">{subtitle}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">{content}</div>
    </div>
  );
}
