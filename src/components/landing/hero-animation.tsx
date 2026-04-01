"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FileText, Search, CheckCircle, Scale, BookOpen,
  Shield, Users, Gavel, AlertTriangle, ChevronLeft, ChevronRight, Play, Pause,
} from "lucide-react";
import { type Messages } from "@/lib/i18n/locales";

interface HeroAnimationFIDProps {
  t: Messages["demoAssistant"];
}

const PHASES = [
  { id: "question", duration: 3000 },
  { id: "reference", duration: 2000 },
  { id: "answer", duration: 3000 },
  { id: "legal", duration: 4000 },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

const scenarioIcons = [Scale, BookOpen, Users, Shield, AlertTriangle, Gavel];
const scenarioColors = ["#6366f1", "#3b82f6", "#8b5cf6", "#0ea5e9", "#ef4444", "#f59e0b"];
const blockIcons = [Search, Scale, BookOpen, CheckCircle];
const blockColors = ["#6366f1", "#3b82f6", "#8b5cf6", "#10b981"];

export function HeroAnimationFID({ t }: HeroAnimationFIDProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const currentPhase: PhaseId = PHASES[phase].id;
  const scenario = t.scenarios[scenarioIdx];
  const ScenarioIcon = scenarioIcons[scenarioIdx % scenarioIcons.length];
  const scenarioColor = scenarioColors[scenarioIdx % scenarioColors.length];

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setPhase((prev) => {
        const next = (prev + 1) % PHASES.length;
        if (next === 0) setScenarioIdx((s) => (s + 1) % t.scenarios.length);
        return next;
      });
    }, PHASES[phase].duration);
    return () => clearTimeout(timeout);
  }, [phase, isPlaying, t.scenarios.length]);

  useEffect(() => { if (isHovered) setIsPlaying(false); }, [isHovered]);

  const goToScenario = useCallback((idx: number) => { setScenarioIdx(idx); setPhase(0); setIsPlaying(true); }, []);
  const prevScenario = useCallback(() => { goToScenario((scenarioIdx - 1 + t.scenarios.length) % t.scenarios.length); }, [scenarioIdx, goToScenario, t.scenarios.length]);
  const nextScenario = useCallback(() => { goToScenario((scenarioIdx + 1) % t.scenarios.length); }, [scenarioIdx, goToScenario, t.scenarios.length]);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const showRef = currentPhase !== "question";
  const showAnswer = currentPhase === "answer" || currentPhase === "legal";
  const showLegal = currentPhase === "legal";

  return (
    <div className="relative mx-auto w-full max-w-xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setIsPlaying(true); }}>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-md">
        <div className="h-0.5 bg-slate-100"><motion.div animate={{ width: `${((phase + 1) / PHASES.length) * 100}%` }} transition={{ duration: 0.5 }} className="h-full rounded-r-full bg-gradient-to-r from-blue-500 to-violet-500" /></div>

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
          <div className="flex items-center gap-2.5">
            <motion.div animate={{ backgroundColor: scenarioColor + "15" }} className="flex h-7 w-7 items-center justify-center rounded-lg"><ScenarioIcon className="h-3.5 w-3.5" style={{ color: scenarioColor }} /></motion.div>
            <AnimatePresence mode="wait"><motion.span key={scenario.theme} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="text-xs font-semibold" style={{ color: scenarioColor }}>{scenario.theme}</motion.span></AnimatePresence>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            {[{ label: "Question", idx: 0 }, { label: "Référence", idx: 1 }, { label: "Réponse", idx: 2 }, { label: "Base légale", idx: 3 }].map((p) => (
              <div key={p.idx} className="flex items-center gap-1.5">
                <motion.div animate={{ backgroundColor: phase >= p.idx ? "#6366f1" : "#e4e4e7", scale: phase === p.idx ? 1.3 : 1 }} transition={{ duration: 0.3 }} className="h-1.5 w-1.5 rounded-full" />
                <motion.span animate={{ color: phase === p.idx ? "#6366f1" : "#a1a1aa", fontWeight: phase === p.idx ? 600 : 400 }} className="text-[9px]">{p.label}</motion.span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <AnimatePresence mode="wait">
            <motion.div key={`q-${scenarioIdx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
              <motion.p animate={{ color: currentPhase === "question" ? "#18181b" : "#52525b", fontSize: currentPhase === "question" ? "14px" : "13px" }} className="leading-relaxed">{scenario.question}</motion.p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showRef && (
              <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 12 }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-100"><FileText className="h-3 w-3 text-indigo-500" /></div>
                  <span className="text-[11px] font-semibold text-indigo-700">{scenario.reference}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAnswer && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }} className="mt-3">
                <div className="mb-1.5 flex items-center gap-1.5"><Search className="h-3 w-3 text-emerald-500" /><span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Réponse</span></div>
                <p className="rounded-lg bg-emerald-50/70 px-3 py-2.5 text-[12px] font-medium leading-relaxed text-emerald-800">{scenario.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showLegal && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }} className="mt-3">
                <div className="mb-2 flex items-center gap-1.5"><Scale className="h-3 w-3 text-blue-500" /><span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Base légale</span></div>
                <div className="space-y-1.5">
                  {scenario.legalPoints.map((point, i) => (
                    <motion.div key={`${scenarioIdx}-lp-${i}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.12 }} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 400 }}><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" /></motion.div>
                      <span className="text-[11px] leading-relaxed text-slate-700">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
          <div className="flex items-center gap-1">
            <button onClick={prevScenario} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <span className="min-w-[32px] text-center text-[10px] font-medium text-slate-400">{scenarioIdx + 1}/{t.scenarios.length}</span>
            <button onClick={nextScenario} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
          <div className="flex items-center gap-1">
            {t.scenarios.map((s, i) => (
              <button key={i} onClick={() => goToScenario(i)} className="p-0.5">
                <motion.div animate={{ width: scenarioIdx === i ? 16 : 6, backgroundColor: scenarioIdx === i ? scenarioColors[i % scenarioColors.length] : "#d4d4d8" }} whileHover={{ scale: 1.3 }} transition={{ duration: 0.25 }} className="h-1.5 rounded-full" />
              </button>
            ))}
          </div>
          <button onClick={togglePlay} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">{isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}</button>
        </div>
      </div>
    </div>
  );
}
