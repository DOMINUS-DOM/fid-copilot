"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FileText, Scale, Sparkles, CheckCircle, Download,
  Pencil, Wand2, Minus, Plus, Building2,
} from "lucide-react";

/* ================================================================
   6 PHASES — slow, cinematic
   ================================================================ */

const PHASES = [
  { id: "input", duration: 4000 },
  { id: "analyze", duration: 3500 },
  { id: "generate", duration: 5000 },
  { id: "legal", duration: 3500 },
  { id: "interact", duration: 3000 },
  { id: "export", duration: 3000 },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

const TYPED_TEXT = "Un élève a été exclu, je dois rédiger un courrier officiel";

const ANALYZE_STEPS = [
  { icon: "🧩", label: "Situation identifiée", delay: 0 },
  { icon: "⚖️", label: "Cadre légal détecté", delay: 0.4 },
  { icon: "📝", label: "Type de document : courrier", delay: 0.8 },
];

const DOC_LINES = [
  { type: "header", text: "Athénée Royal des Collines" },
  { type: "sub", text: "Avenue de l'Europe, 12 — 1348 Louvain-la-Neuve" },
  { type: "spacer", text: "" },
  { type: "bold", text: "Objet : Notification d'exclusion définitive" },
  { type: "spacer", text: "" },
  { type: "body", text: "Madame, Monsieur," },
  { type: "body", text: "Nous vous informons par la présente de la décision d'exclusion définitive concernant votre enfant..." },
  { type: "legal", text: "Conformément aux articles 1.7.9.4 à 1.7.9.6 du Code de l'enseignement..." },
  { type: "body", text: "Cette décision a été prise après audition et examen des faits." },
];

const INTERACT_BUTTONS = [
  { icon: Pencil, label: "Modifier" },
  { icon: Wand2, label: "Adapter" },
  { icon: Minus, label: "Simplifier" },
  { icon: Plus, label: "Ajouter" },
];

/* ================================================================
   TYPING HOOK
   ================================================================ */

function useTypingEffect(text: string, isActive: boolean, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!isActive) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, isActive, speed]);
  return displayed;
}

/* ================================================================
   COMPONENT
   ================================================================ */

export function HeroDocumentAnimation() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interactIdx, setInteractIdx] = useState(-1);

  const currentPhase: PhaseId = PHASES[phase].id;

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setPhase((prev) => (prev + 1) % PHASES.length);
      setInteractIdx(-1);
    }, PHASES[phase].duration);
    return () => clearTimeout(timeout);
  }, [phase, isPlaying]);

  const typedText = useTypingEffect(TYPED_TEXT, currentPhase === "input");

  const handleInteract = useCallback((idx: number) => {
    setInteractIdx(idx);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 1500);
  }, []);

  // Phase index for progress
  const phaseIdx = phase;
  const progressPct = ((phaseIdx + 1) / PHASES.length) * 100;

  return (
    <div className="relative mx-auto mt-8 w-full max-w-xl">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl shadow-slate-200/40 backdrop-blur-md">

        {/* Progress */}
        <div className="h-0.5 bg-slate-100">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-50">
              <FileText className="h-3 w-3 text-violet-500" />
            </div>
            <span className="text-[11px] font-semibold text-violet-600">Générateur de documents</span>
          </div>
          <div className="flex items-center gap-2">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.id}
                animate={{
                  backgroundColor: phaseIdx >= i ? "#8b5cf6" : "#e4e4e7",
                  scale: phaseIdx === i ? 1.4 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 w-1.5 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="min-h-[280px] px-5 py-4 sm:min-h-[300px] sm:px-6 sm:py-5">

          {/* ── PHASE 1: INPUT ── */}
          <AnimatePresence>
            {currentPhase === "input" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Décrivez votre situation</p>
                <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {/* Glow effect */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-violet-200/30 via-blue-200/30 to-violet-200/30"
                  />
                  <p className="relative text-[13px] leading-relaxed text-slate-800">
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block h-4 w-0.5 translate-y-0.5 bg-violet-500"
                    />
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 2: ANALYZE ── */}
          <AnimatePresence>
            {currentPhase === "analyze" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent"
                  />
                  <span className="text-xs font-semibold text-amber-600">Analyse en cours...</span>
                </div>

                <div className="space-y-2.5">
                  {ANALYZE_STEPS.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: step.delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                    >
                      <span className="text-sm">{step.icon}</span>
                      <span className="text-[11px] font-medium text-slate-700">{step.label}</span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: step.delay + 0.4, type: "spring", stiffness: 400 }}
                        className="ml-auto"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-amber-500" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Data flow lines */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-3 flex items-center justify-center gap-1"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                      className="h-2 w-1 rounded-full bg-amber-400"
                    />
                  ))}
                  <span className="ml-2 text-[10px] text-amber-500">Génération du document...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 3: GENERATE ── */}
          <AnimatePresence>
            {currentPhase === "generate" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {/* Document preview */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {/* Mini logo + header */}
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-50">
                      <Building2 className="h-3 w-3 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800">Athénée Royal des Collines</p>
                      <p className="text-[8px] text-slate-400">Avenue de l'Europe, 12</p>
                    </div>
                  </div>

                  {/* Lines appearing */}
                  {DOC_LINES.map((line, i) => {
                    if (line.type === "spacer") {
                      return <div key={i} className="h-2" />;
                    }
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.35, duration: 0.4 }}
                      >
                        <p
                          className={`leading-relaxed ${
                            line.type === "header" ? "text-[11px] font-bold text-slate-900" :
                            line.type === "sub" ? "text-[9px] text-slate-400" :
                            line.type === "bold" ? "text-[10px] font-semibold text-slate-800" :
                            line.type === "legal" ? "text-[10px] font-medium text-blue-700 bg-blue-50/50 rounded px-1.5 py-0.5 inline" :
                            "text-[10px] text-slate-600"
                          }`}
                        >
                          {line.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 4: LEGAL HIGHLIGHT ── */}
          <AnimatePresence>
            {currentPhase === "legal" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {/* Document context */}
                  <p className="text-[10px] text-slate-400">...concernant votre enfant...</p>
                  <div className="my-3 space-y-2">
                    {/* Highlighted legal line */}
                    <motion.div
                      initial={{ backgroundColor: "transparent" }}
                      animate={{ backgroundColor: ["transparent", "#dbeafe", "#dbeafe"] }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="rounded-lg px-2.5 py-2"
                    >
                      <p className="text-[11px] font-medium leading-relaxed text-blue-900">
                        {"Conformément aux articles 1.7.9.4 à 1.7.9.6 du Code de l'enseignement, cette décision a été prise dans le respect de la procédure légale."}
                      </p>
                    </motion.div>

                    {/* Legal badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
                      className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2"
                    >
                      <motion.div
                        animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 8px 2px rgba(99,102,241,0.3)", "0 0 0 0 rgba(99,102,241,0)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex h-5 w-5 items-center justify-center rounded bg-indigo-100"
                      >
                        <Scale className="h-3 w-3 text-indigo-600" />
                      </motion.div>
                      <div>
                        <p className="text-[10px] font-bold text-indigo-700">Base légale vérifiée</p>
                        <p className="text-[9px] text-indigo-500">Code de l'enseignement — Art. 1.7.9.4 à 1.7.9.6</p>
                      </div>
                    </motion.div>

                    {/* Second highlight */}
                    <motion.div
                      initial={{ backgroundColor: "transparent" }}
                      animate={{ backgroundColor: ["transparent", "#fef3c7", "#fef3c7"] }}
                      transition={{ duration: 1, delay: 1.5 }}
                      className="rounded-lg px-2.5 py-2"
                    >
                      <p className="text-[11px] leading-relaxed text-amber-900">
                        {"L'élève et ses responsables ont été entendus conformément au droit d'audition prévu par la procédure."}
                      </p>
                    </motion.div>
                  </div>
                  <p className="text-[10px] text-slate-400">Cette décision a été prise après examen...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 5: INTERACT ── */}
          <AnimatePresence>
            {currentPhase === "interact" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Personnalisez votre document</p>

                <div className="mb-4 grid grid-cols-4 gap-2">
                  {INTERACT_BUTTONS.map((btn, i) => (
                    <motion.button
                      key={btn.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInteract(i)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[10px] font-medium transition-colors ${
                        interactIdx === i
                          ? "border-violet-300 bg-violet-50 text-violet-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <btn.icon className="h-4 w-4" />
                      {btn.label}
                    </motion.button>
                  ))}
                </div>

                {/* Morphing text preview */}
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={interactIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] leading-relaxed text-slate-700"
                    >
                      {interactIdx === 0
                        ? "Nous vous informons de la décision d'exclusion définitive prise à l'encontre de votre enfant..."
                        : interactIdx === 1
                          ? "Suite aux faits survenus le [DATE], nous avons pris la décision suivante concernant votre enfant..."
                          : interactIdx === 2
                            ? "Votre enfant est exclu. Vous disposez d'un droit de recours."
                            : interactIdx === 3
                              ? "Nous vous informons par la présente de la décision d'exclusion définitive. Un accompagnement sera proposé pour faciliter la transition..."
                              : "Nous vous informons par la présente de la décision d'exclusion définitive concernant votre enfant..."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PHASE 6: EXPORT ── */}
          <AnimatePresence>
            {currentPhase === "export" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-4"
              >
                {/* PDF preview card */}
                <motion.div
                  initial={{ scale: 0.9, rotateX: 10 }}
                  animate={{ scale: 1, rotateX: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="mb-4 w-40 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <div className="mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <div className="h-3 w-3 rounded bg-blue-100" />
                    <div className="h-1.5 w-12 rounded bg-slate-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full rounded bg-slate-100" />
                    <div className="h-1 w-full rounded bg-slate-100" />
                    <div className="h-1 w-3/4 rounded bg-blue-100" />
                    <div className="h-1 w-full rounded bg-slate-100" />
                    <div className="h-1 w-2/3 rounded bg-slate-100" />
                  </div>
                  <div className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-1.5">
                    <div className="h-1 w-8 rounded bg-slate-200" />
                    <div className="ml-auto h-1 w-4 rounded bg-emerald-200" />
                  </div>
                </motion.div>

                {/* Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  <Download className="h-3.5 w-3.5" />
                  Générer PDF
                </motion.div>

                {/* Success */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 300 }}
                  className="mt-3 flex items-center gap-1.5"
                >
                  <motion.div
                    animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 12px 4px rgba(16,185,129,0.2)", "0 0 0 0 rgba(16,185,129,0)"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </motion.div>
                  <span className="text-[11px] font-semibold text-emerald-600">Document prêt à envoyer</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
