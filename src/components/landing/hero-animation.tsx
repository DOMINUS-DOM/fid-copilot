"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FileText, Search, CheckCircle, Scale, BookOpen,
  Shield, Users, Gavel, AlertTriangle, ChevronLeft, ChevronRight, Play, Pause,
} from "lucide-react";

/* ================================================================
   6 SCÉNARIOS FID — CONTENU EXACT FOURNI
   ================================================================ */

const SCENARIOS = [
  {
    icon: Scale,
    theme: "Missions prioritaires",
    color: "#6366f1",
    question: "Quelles sont les missions prioritaires de l'enseignement ?",
    reference: "Code de l'enseignement — Article 1.4.1.1",
    answer: "Les missions prioritaires sont exercées simultanément et sans hiérarchie. Elles visent à former des élèves autonomes, responsables et capables de s'insérer dans la société.",
    legalPoints: [
      "Promouvoir la confiance en soi et le développement de chaque élève",
      "Amener les élèves à acquérir des savoirs, savoir-faire et compétences",
      "Former des citoyens responsables",
      "Assurer des chances égales d'émancipation sociale",
    ],
  },
  {
    icon: BookOpen,
    theme: "Changement d'option",
    color: "#3b82f6",
    question: "Un élève peut-il changer d'option après le 15 novembre ?",
    reference: "Arrêté royal du 29 juin 1984 — Article 20 §3",
    answer: "Oui, mais à partir du 16 novembre, le changement est soumis à l'accord du directeur, après avis du conseil de classe.",
    legalPoints: [
      "Changement possible jusqu'au 15 mai",
      "Avis favorable du directeur requis",
      "Avis du conseil de classe",
      "Peut être refusé pour raisons légales ou organisationnelles",
    ],
  },
  {
    icon: Users,
    theme: "Organisation horaire",
    color: "#8b5cf6",
    question: "Peut-on organiser des périodes de cours de 45 minutes ?",
    reference: "Arrêté royal du 29 juin 1984 — Article 1 §2",
    answer: "Oui, sous conditions strictes et après concertation avec les organes compétents.",
    legalPoints: [
      "Consultation de l'équipe éducative",
      "Avis favorable des instances de concertation",
      "Mise en place d'activités pédagogiques utiles",
      "Respect de la charge des enseignants",
    ],
  },
  {
    icon: Shield,
    theme: "DAccE",
    color: "#0ea5e9",
    question: "Les parents ont-ils accès au DAccE ?",
    reference: "Code de l'enseignement — Articles 1.10.2-2 et 1.10.3",
    answer: "Oui, les parents d'un élève mineur ont accès au DAccE de leur enfant.",
    legalPoints: [
      "Volet administratif",
      "Volet parcours scolaire",
      "Volet suivi de l'élève et fréquentation",
      "L'élève majeur y accède lui-même",
    ],
  },
  {
    icon: AlertTriangle,
    theme: "Exclusion / Écartement",
    color: "#ef4444",
    question: "Une exclusion définitive ou un écartement immédiat est-il possible ?",
    reference: "Code de l'enseignement — Articles 1.7.9.4 à 1.7.9.6",
    answer: "Oui, en cas de faits graves, une exclusion définitive peut être décidée et un écartement temporaire peut être appliqué immédiatement.",
    legalPoints: [
      "Exclusion possible pour faits graves",
      "Écartement immédiat possible (durée limitée)",
      "Décision prise par le PO ou son délégué",
      "Procédure encadrée légalement",
    ],
  },
  {
    icon: Gavel,
    theme: "Formation obligatoire",
    color: "#f59e0b",
    question: "Les formations pédagogiques décidées par l'école sont-elles obligatoires ?",
    reference: "Code de l'enseignement — Article 6.1.3-2",
    answer: "Oui, les formations répondant à des besoins collectifs sont obligatoires pour les enseignants.",
    legalPoints: [
      "Formations collectives → obligatoires",
      "Formations individuelles → facultatives",
      "Organisation dans le cadre du plan de formation",
      "6 demi-jours par an capitalisables",
    ],
  },
];

/* ================================================================
   PHASES — slow, readable
   ================================================================ */

const PHASES = [
  { id: "question", duration: 3000 },
  { id: "reference", duration: 2000 },
  { id: "answer", duration: 3000 },
  { id: "legal", duration: 4000 },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

/* ================================================================
   COMPONENT
   ================================================================ */

export function HeroAnimationFID() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const currentPhase: PhaseId = PHASES[phase].id;
  const scenario = SCENARIOS[scenarioIdx];
  const ScenarioIcon = scenario.icon;

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setPhase((prev) => {
        const next = (prev + 1) % PHASES.length;
        if (next === 0) setScenarioIdx((s) => (s + 1) % SCENARIOS.length);
        return next;
      });
    }, PHASES[phase].duration);
    return () => clearTimeout(timeout);
  }, [phase, isPlaying]);

  useEffect(() => {
    if (isHovered) setIsPlaying(false);
  }, [isHovered]);

  const goToScenario = useCallback((idx: number) => {
    setScenarioIdx(idx);
    setPhase(0);
    setIsPlaying(true);
  }, []);

  const prevScenario = useCallback(() => {
    goToScenario((scenarioIdx - 1 + SCENARIOS.length) % SCENARIOS.length);
  }, [scenarioIdx, goToScenario]);

  const nextScenario = useCallback(() => {
    goToScenario((scenarioIdx + 1) % SCENARIOS.length);
  }, [scenarioIdx, goToScenario]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const phaseProgress = ((phase + 1) / PHASES.length) * 100;
  const showRef = currentPhase !== "question";
  const showAnswer = currentPhase === "answer" || currentPhase === "legal";
  const showLegal = currentPhase === "legal";

  return (
    <div
      className="relative mx-auto mt-12 w-full max-w-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPlaying(true); }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-md">

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <motion.div
            animate={{ width: `${phaseProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-r-full bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ backgroundColor: scenario.color + "15" }}
              className="flex h-7 w-7 items-center justify-center rounded-lg"
            >
              <ScenarioIcon className="h-3.5 w-3.5" style={{ color: scenario.color }} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.span
                key={scenario.theme}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="text-xs font-semibold"
                style={{ color: scenario.color }}
              >
                {scenario.theme}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Phase labels */}
          <div className="hidden items-center gap-3 sm:flex">
            {[
              { id: "question", label: "Question", idx: 0 },
              { id: "reference", label: "Référence", idx: 1 },
              { id: "answer", label: "Réponse", idx: 2 },
              { id: "legal", label: "Base légale", idx: 3 },
            ].map((p) => (
              <div key={p.id} className="flex items-center gap-1.5">
                <motion.div
                  animate={{
                    backgroundColor: phase >= p.idx ? "#6366f1" : "#e4e4e7",
                    scale: phase === p.idx ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-1.5 w-1.5 rounded-full"
                />
                <motion.span
                  animate={{
                    color: phase === p.idx ? "#6366f1" : "#a1a1aa",
                    fontWeight: phase === p.idx ? 600 : 400,
                  }}
                  className="text-[9px]"
                >
                  {p.label}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 sm:px-6 sm:py-5">

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`q-${scenarioIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.p
                animate={{
                  color: currentPhase === "question" ? "#18181b" : "#52525b",
                  fontSize: currentPhase === "question" ? "14px" : "13px",
                }}
                transition={{ duration: 0.3 }}
                className="leading-relaxed"
              >
                {scenario.question}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Reference juridique */}
          <AnimatePresence>
            {showRef && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-100">
                    <FileText className="h-3 w-3 text-indigo-500" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={scenario.reference}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] font-semibold text-indigo-700"
                    >
                      {scenario.reference}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Réponse */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-3"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Search className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Réponse</span>
                </div>
                <p className="rounded-lg bg-emerald-50/70 px-3 py-2.5 text-[12px] font-medium leading-relaxed text-emerald-800">
                  {scenario.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Base légale — points détaillés */}
          <AnimatePresence>
            {showLegal && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-3"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Scale className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Base légale</span>
                </div>
                <div className="space-y-1.5">
                  {scenario.legalPoints.map((point, i) => (
                    <motion.div
                      key={`${scenarioIdx}-lp-${i}`}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 400 }}
                      >
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                      </motion.div>
                      <span className="text-[11px] leading-relaxed text-slate-700">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
          <div className="flex items-center gap-1">
            <button onClick={prevScenario} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" aria-label="Précédent">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[32px] text-center text-[10px] font-medium text-slate-400">
              {scenarioIdx + 1}/{SCENARIOS.length}
            </span>
            <button onClick={nextScenario} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" aria-label="Suivant">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => goToScenario(i)} className="p-0.5" aria-label={s.theme}>
                <motion.div
                  animate={{
                    width: scenarioIdx === i ? 16 : 6,
                    backgroundColor: scenarioIdx === i ? s.color : "#d4d4d8",
                  }}
                  whileHover={{ scale: 1.3, backgroundColor: s.color }}
                  transition={{ duration: 0.25 }}
                  className="h-1.5 rounded-full"
                />
              </button>
            ))}
          </div>

          <button onClick={togglePlay} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" aria-label={isPlaying ? "Pause" : "Lecture"}>
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}
