"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FileText, Upload, Shield, CheckCircle, Search, Scale, BookOpen,
  Play, Pause, RotateCcw,
} from "lucide-react";
import { type Messages } from "@/lib/i18n/locales";

interface HeroNarrativeProps {
  t: Messages["narrative"];
}

const SCENES = [
  { id: "complexity", duration: 5000 },
  { id: "chaos", duration: 4500 },
  { id: "appear", duration: 4000 },
  { id: "import", duration: 4500 },
  { id: "adapt", duration: 5000 },
  { id: "generate", duration: 5000 },
  { id: "secure", duration: 4500 },
  { id: "difference", duration: 5000 },
  { id: "conclusion", duration: 5000 },
] as const;

const structureIcons = [Search, Scale, BookOpen, CheckCircle];
const structureColors = ["#6366f1", "#3b82f6", "#8b5cf6", "#10b981"];

export function HeroNarrative({ t }: HeroNarrativeProps) {
  const [scene, setScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const currentId = SCENES[scene].id;

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setScene((prev) => (prev + 1) % SCENES.length);
    }, SCENES[scene].duration);
    return () => clearTimeout(timeout);
  }, [scene, isPlaying]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const restart = useCallback(() => { setScene(0); setIsPlaying(true); }, []);
  const progress = ((scene + 1) / SCENES.length) * 100;

  const s = t.scenes;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">{t.sectionSubtitle}</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t.sectionTitle}</h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-xl shadow-slate-200/30">
          <div className="h-0.5 bg-slate-100">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="h-full bg-gradient-to-r from-blue-500 to-violet-500" />
          </div>

          <div className="relative min-h-[340px] overflow-hidden px-6 py-8 sm:min-h-[380px] sm:px-10 sm:py-10">
            <AnimatePresence mode="wait">

              {currentId === "complexity" && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <div className="relative mb-6 h-40 w-full max-w-sm">
                    {["ROI", "Règlement", "Procédures", "Notes", "Cadre légal"].map((doc, i) => (
                      <motion.div key={doc} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, rotate: (i - 2) * 6, x: (i - 2) * 15 }} transition={{ delay: i * 0.3, duration: 0.5, type: "spring" }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 - i }}>
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-md">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="whitespace-nowrap text-xs font-medium text-slate-600">{doc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="text-center text-lg font-semibold text-slate-900">{s.complexity.title}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-2 text-center text-sm text-slate-500">{s.complexity.subtitle}</motion.p>
                </motion.div>
              )}

              {currentId === "chaos" && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <div className="relative mb-6 flex h-36 w-full max-w-xs items-center justify-center">
                    {s.chaos.labels.map((type, i) => (
                      <motion.div key={type} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0.6], x: Math.sin(i * 1.3) * 60, y: Math.cos(i * 1.3) * 40, rotate: (i - 2) * 12 }} transition={{ delay: i * 0.2, duration: 1.5 }} className="absolute">
                        <div className={`rounded-md border px-3 py-1.5 text-[10px] font-medium ${i % 2 === 0 ? "border-red-200 bg-red-50 text-red-600" : "border-amber-200 bg-amber-50 text-amber-600"}`}>{type}</div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-center text-lg font-semibold text-slate-900">{s.chaos.title}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-2 text-center text-sm text-slate-500">{s.chaos.subtitle}</motion.p>
                </motion.div>
              )}

              {currentId === "appear" && (
                <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: "spring" }} className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl shadow-blue-500/30">
                    <Shield className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl font-bold text-slate-900">FID <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Copilot</span></motion.h3>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-2 text-sm text-slate-500">{s.appear.subtitle}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2.5">
                    <p className="text-xs text-blue-700">{s.appear.tagline}</p>
                  </motion.div>
                </motion.div>
              )}

              {currentId === "import" && (
                <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <div className="mb-4 flex items-center gap-2"><Upload className="h-4 w-4 text-blue-500" /><span className="text-xs font-semibold text-blue-600">{s.import.badge}</span></div>
                  <div className="mb-6 w-full max-w-xs space-y-2">
                    {s.import.files.map((file, i) => (
                      <motion.div key={file} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5, duration: 0.5, type: "spring" }} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                        <span className="text-base">{"📄"}</span>
                        <span className="flex-1 text-xs font-medium text-slate-700">{file}</span>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.5 + 0.4, type: "spring", stiffness: 300 }}><CheckCircle className="h-4 w-4 text-emerald-500" /></motion.div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-center text-lg font-semibold text-slate-900">{s.import.title}</motion.p>
                </motion.div>
              )}

              {currentId === "adapt" && (
                <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <div className="relative mb-6 flex h-44 w-full max-w-sm items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: "spring" }} className="z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg"><Shield className="h-7 w-7 text-white" /></motion.div>
                    {t.structureLabels.map((label, i) => {
                      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
                      return (
                        <motion.div key={label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, x: Math.cos(angle) * 100, y: Math.sin(angle) * 70 }} transition={{ delay: 0.8 + i * 0.2, duration: 0.4, type: "spring" }} className="absolute flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 shadow-sm">
                          {(() => { const Icon = structureIcons[i]; return <Icon className="h-3 w-3" style={{ color: structureColors[i] }} />; })()}
                          <span className="whitespace-nowrap text-[9px] font-medium text-slate-600">{label.split(" ").slice(0, 2).join(" ")}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-center text-lg font-semibold text-slate-900">{s.adapt.title}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2">
                    <p className="text-center text-xs font-semibold text-violet-700">{s.adapt.keyMessage}</p>
                  </motion.div>
                </motion.div>
              )}

              {currentId === "generate" && (
                <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <div className="mb-4 w-full max-w-sm space-y-2">
                    {t.structureLabels.map((label, i) => {
                      const Icon = structureIcons[i]; const color = structureColors[i];
                      return (
                        <motion.div key={label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.4, duration: 0.4 }} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}12` }}><Icon className="h-3.5 w-3.5" style={{ color }} /></div>
                          <div className="flex-1"><p className="text-[10px] font-semibold text-slate-800">{label}</p><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: i * 0.4 + 0.3, duration: 0.6 }} className="mt-1 h-1 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ backgroundColor: color, width: "100%" }} /></motion.div></div>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.4 + 0.6, type: "spring" }}><CheckCircle className="h-4 w-4 text-emerald-500" /></motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-center text-lg font-semibold text-slate-900">{s.generate.title}</motion.p>
                </motion.div>
              )}

              {currentId === "secure" && (
                <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, type: "spring" }} className="mb-4">
                    <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(59,130,246,0)", "0 0 20px 8px rgba(59,130,246,0.15)", "0 0 0 0 rgba(59,130,246,0)"] }} transition={{ duration: 2, repeat: Infinity }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50"><Shield className="h-8 w-8 text-blue-600" /></motion.div>
                  </motion.div>
                  <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
                    {s.secure.badges.map((label, i) => (
                      <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.3 }} className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1"><CheckCircle className="h-3 w-3 text-emerald-500" /><span className="text-[10px] font-medium text-emerald-700">{label}</span></motion.div>
                    ))}
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-center text-lg font-semibold text-slate-900">{s.secure.title}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-1 text-center text-xs text-slate-500">{s.secure.subtitle}</motion.p>
                </motion.div>
              )}

              {currentId === "difference" && (
                <motion.div key="s8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.difference.genericLabel}</p>
                      <div className="space-y-2">{s.difference.genericPoints.map((t) => (<div key={t} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-slate-200" /><span className="text-[11px] text-slate-400">{t}</span></div>))}</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600">{s.difference.copilotLabel}</p>
                      <div className="space-y-2">{s.difference.copilotPoints.map((t) => (<div key={t} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-blue-500" /><span className="text-[11px] font-medium text-blue-800">{t}</span></div>))}</div>
                    </motion.div>
                  </div>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-6 text-center text-lg font-semibold text-slate-900">{s.difference.title}</motion.p>
                </motion.div>
              )}

              {currentId === "conclusion" && (
                <motion.div key="s9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center py-4">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring" }}>
                    <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 24px 8px rgba(99,102,241,0.12)", "0 0 0 0 rgba(99,102,241,0)"] }} transition={{ duration: 2.5, repeat: Infinity }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg"><Shield className="h-8 w-8 text-white" /></motion.div>
                  </motion.div>
                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-5 text-center text-2xl font-bold text-slate-900">{s.conclusion.title}</motion.h3>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-2 text-center text-sm text-slate-500">{s.conclusion.subtitle}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-5 flex flex-wrap justify-center gap-2">
                    {s.conclusion.badges.map((msg, i) => (
                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 + i * 0.3 }} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-medium text-blue-700">{msg}</motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
            <button onClick={restart} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"><RotateCcw className="h-3.5 w-3.5" /></button>
            <div className="flex items-center gap-1">
              {SCENES.map((_, i) => (<motion.div key={i} animate={{ width: scene === i ? 14 : 5, backgroundColor: scene === i ? "#6366f1" : scene > i ? "#a5b4fc" : "#d4d4d8" }} transition={{ duration: 0.25 }} className="h-1.5 rounded-full" />))}
            </div>
            <button onClick={togglePlay} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600">{isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
