"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FileText, Scale, CheckCircle, Download, Pencil, Wand2, Minus, Plus, Building2,
} from "lucide-react";
import { type Messages } from "@/lib/i18n/locales";

interface Props {
  t: Messages["demoDocument"];
}

const PHASES = [
  { id: "input", duration: 4000 },
  { id: "analyze", duration: 3500 },
  { id: "generate", duration: 5000 },
  { id: "legal", duration: 3500 },
  { id: "interact", duration: 3000 },
  { id: "export", duration: 3000 },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

const interactIcons = [Pencil, Wand2, Minus, Plus];

function useTypingEffect(text: string, isActive: boolean, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!isActive) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; } else clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, isActive, speed]);
  return displayed;
}

export function HeroDocumentAnimation({ t }: Props) {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interactIdx, setInteractIdx] = useState(-1);
  const currentPhase: PhaseId = PHASES[phase].id;

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => { setPhase((prev) => (prev + 1) % PHASES.length); setInteractIdx(-1); }, PHASES[phase].duration);
    return () => clearTimeout(timeout);
  }, [phase, isPlaying]);

  const typedText = useTypingEffect(t.typedText, currentPhase === "input");
  const handleInteract = useCallback((idx: number) => { setInteractIdx(idx); setIsPlaying(false); setTimeout(() => setIsPlaying(true), 1500); }, []);
  const progressPct = ((phase + 1) / PHASES.length) * 100;

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-md">
        <div className="h-0.5 bg-slate-100"><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-violet-500 to-blue-500" /></div>

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2">
          <div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-50"><FileText className="h-3 w-3 text-violet-500" /></div><span className="text-[11px] font-semibold text-violet-600">{t.sectionLabel}</span></div>
          <div className="flex items-center gap-2">{PHASES.map((p, i) => (<motion.div key={p.id} animate={{ backgroundColor: phase >= i ? "#8b5cf6" : "#e4e4e7", scale: phase === i ? 1.4 : 1 }} transition={{ duration: 0.3 }} className="h-1.5 w-1.5 rounded-full" />))}</div>
        </div>

        <div className="min-h-[280px] px-5 py-4 sm:min-h-[300px] sm:px-6 sm:py-5">

          <AnimatePresence>
            {currentPhase === "input" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t.inputPlaceholder}</p>
                <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-violet-200/30 via-blue-200/30 to-violet-200/30" />
                  <p className="relative text-[13px] leading-relaxed text-slate-800">{typedText}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="inline-block h-4 w-0.5 translate-y-0.5 bg-violet-500" /></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPhase === "analyze" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                <div className="mb-4 flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent" /><span className="text-xs font-semibold text-amber-600">{t.analyzeLabel}</span></div>
                <div className="space-y-2.5">
                  {t.analyzeSteps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4, duration: 0.5 }} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
                      <span className="text-sm">{["🧩", "⚖️", "📝"][i]}</span>
                      <span className="text-[11px] font-medium text-slate-700">{step}</span>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.4 + 0.4, type: "spring" }} className="ml-auto"><CheckCircle className="h-3.5 w-3.5 text-amber-500" /></motion.div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-3 flex items-center justify-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (<motion.div key={i} animate={{ scaleY: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} className="h-2 w-1 rounded-full bg-amber-400" />))}
                  <span className="ml-2 text-[10px] text-amber-500">{t.generateLabel}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPhase === "generate" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-50"><Building2 className="h-3 w-3 text-blue-500" /></div>
                    <div><p className="text-[10px] font-bold text-slate-800">{t.docHeader}</p><p className="text-[8px] text-slate-400">{t.docAddress}</p></div>
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] font-semibold text-slate-800">{t.docSubject}</motion.p>
                  <div className="h-2" />
                  {t.docBody.map((line, i) => (
                    <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.5 }} className="text-[10px] leading-relaxed text-slate-600">{line}</motion.p>
                  ))}
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-1 inline rounded bg-blue-50/50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">{t.legalHighlight.slice(0, 80)}...</motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPhase === "legal" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <motion.div initial={{ backgroundColor: "transparent" }} animate={{ backgroundColor: ["transparent", "#dbeafe", "#dbeafe"] }} transition={{ duration: 1, delay: 0.3 }} className="rounded-lg px-2.5 py-2">
                    <p className="text-[11px] font-medium leading-relaxed text-blue-900">{t.legalHighlight}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="mt-2 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
                    <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 8px 2px rgba(99,102,241,0.3)", "0 0 0 0 rgba(99,102,241,0)"] }} transition={{ duration: 2, repeat: Infinity }} className="flex h-5 w-5 items-center justify-center rounded bg-indigo-100"><Scale className="h-3 w-3 text-indigo-600" /></motion.div>
                    <div><p className="text-[10px] font-bold text-indigo-700">{t.legalBadgeTitle}</p><p className="text-[9px] text-indigo-500">{t.legalBadgeRef}</p></div>
                  </motion.div>
                  <motion.div initial={{ backgroundColor: "transparent" }} animate={{ backgroundColor: ["transparent", "#fef3c7", "#fef3c7"] }} transition={{ duration: 1, delay: 1.5 }} className="mt-2 rounded-lg px-2.5 py-2">
                    <p className="text-[11px] leading-relaxed text-amber-900">{t.legalHighlight2}</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPhase === "interact" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t.interactTitle}</p>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {t.interactButtons.map((label, i) => { const Icon = interactIcons[i]; return (
                    <motion.button key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleInteract(i)} className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[10px] font-medium transition-colors ${interactIdx === i ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                      <Icon className="h-4 w-4" />{label}
                    </motion.button>
                  ); })}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                  <AnimatePresence mode="wait">
                    <motion.p key={interactIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] leading-relaxed text-slate-700">
                      {interactIdx >= 0 && interactIdx < t.interactVariants.length ? t.interactVariants[interactIdx] : t.docBody[1] || t.typedText}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPhase === "export" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center py-4">
                <motion.div initial={{ scale: 0.9, rotateX: 10 }} animate={{ scale: 1, rotateX: 0 }} transition={{ duration: 0.6, type: "spring" }} className="mb-4 w-40 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5"><div className="h-3 w-3 rounded bg-blue-100" /><div className="h-1.5 w-12 rounded bg-slate-200" /></div>
                  <div className="space-y-1"><div className="h-1 w-full rounded bg-slate-100" /><div className="h-1 w-full rounded bg-slate-100" /><div className="h-1 w-3/4 rounded bg-blue-100" /><div className="h-1 w-full rounded bg-slate-100" /></div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25">
                  <Download className="h-3.5 w-3.5" />{t.exportButton}
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring" }} className="mt-3 flex items-center gap-1.5">
                  <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 12px 4px rgba(16,185,129,0.2)", "0 0 0 0 rgba(16,185,129,0)"] }} transition={{ duration: 1.5, repeat: Infinity }}><CheckCircle className="h-4 w-4 text-emerald-500" /></motion.div>
                  <span className="text-[11px] font-semibold text-emerald-600">{t.exportSuccess}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
