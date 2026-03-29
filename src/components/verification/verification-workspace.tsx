"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  type VerifyType,
  type VerifyDepth,
  VERIFY_TYPE_CONFIG,
  VERIFY_DEPTH_CONFIG,
} from "@/types";
import {
  ShieldCheck,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

// ============================================================
// Section styling for verification results
// ============================================================

const SECTION_STYLES: Record<string, { border: string; bg: string; icon: React.ReactNode }> = {
  diagnostic: {
    border: "border-l-slate-400",
    bg: "bg-slate-50/50 dark:bg-slate-800/20",
    icon: <ClipboardCheck className="h-4 w-4 text-slate-500" />,
  },
  conformes: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
    icon: <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  },
  sensibles: {
    border: "border-l-amber-500",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
    icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  },
  corrections: {
    border: "border-l-red-500",
    bg: "bg-red-50/30 dark:bg-red-950/15",
    icon: <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />,
  },
  alerte: {
    border: "border-l-violet-500",
    bg: "bg-violet-50/30 dark:bg-violet-950/15",
    icon: <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />,
  },
  recommandation: {
    border: "border-l-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    icon: <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  },
};

function getSectionStyle(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("diagnostic")) return SECTION_STYLES.diagnostic;
  if (lower.includes("conforme")) return SECTION_STYLES.conformes;
  if (lower.includes("sensible")) return SECTION_STYLES.sensibles;
  if (lower.includes("correction")) return SECTION_STYLES.corrections;
  if (lower.includes("alerte")) return SECTION_STYLES.alerte;
  if (lower.includes("recommandation")) return SECTION_STYLES.recommandation;
  return { border: "border-l-zinc-300", bg: "bg-zinc-50/30 dark:bg-zinc-800/20", icon: null };
}

// ============================================================
// Main component
// ============================================================

export function VerificationWorkspace() {
  const [type, setType] = useState<VerifyType>("document");
  const [depth, setDepth] = useState<VerifyDepth>("standard");
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const typeConfig = VERIFY_TYPE_CONFIG[type];

  async function handleVerify(e?: React.FormEvent) {
    e?.preventDefault();
    if (!content.trim() || content.trim().length < 20) return;

    setError("");
    setAnalysis("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          depth,
          content: content.trim(),
          context: context.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la vérification");
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ============================================================ */}
      {/* LEFT — Input */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-5">
        {/* Type selector */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Type de vérification
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(VERIFY_TYPE_CONFIG) as VerifyType[]).map((t) => {
              const cfg = VERIFY_TYPE_CONFIG[t];
              const isActive = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex flex-col rounded-xl border px-3 py-3 text-left transition-all",
                    isActive
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                      : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-zinc-700"
                  )}
                >
                  <span className={cn("text-xs font-semibold", isActive ? "text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300")}>
                    {cfg.label}
                  </span>
                  <span className={cn("mt-0.5 text-[11px]", isActive ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500")}>
                    {cfg.description}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content to verify */}
        <Card>
          <label htmlFor="verify-content" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Contenu à vérifier
          </label>
          <textarea
            id="verify-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={typeConfig.placeholder}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          {content.length > 0 && content.trim().length < 20 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Le contenu doit faire au moins quelques phrases.
            </p>
          )}
        </Card>

        {/* Depth + Context */}
        <Card>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">Niveau d{"'"}analyse</p>
              <div className="flex gap-2">
                {(Object.keys(VERIFY_DEPTH_CONFIG) as VerifyDepth[]).map((d) => {
                  const cfg = VERIFY_DEPTH_CONFIG[d];
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepth(d)}
                      className={cn(
                        "flex-1 rounded-xl border px-3 py-2.5 text-center transition-all",
                        depth === d
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                      )}
                    >
                      <span className={cn("block text-xs font-medium", depth === d ? "text-blue-700 dark:text-blue-300" : "text-zinc-600 dark:text-zinc-400")}>
                        {cfg.label}
                      </span>
                      <span className={cn("block text-[10px]", depth === d ? "text-blue-500 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500")}>
                        {cfg.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Contexte additionnel (optionnel)</label>
              <textarea
                rows={2}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ex : ce courrier fait suite à un incident en cours de récréation..."
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </Card>

        <Button
          onClick={() => handleVerify()}
          disabled={loading || content.trim().length < 20}
          className="self-start"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Vérification...</>
          ) : (
            <><ShieldCheck className="mr-2 h-4 w-4" />Vérifier</>
          )}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* RIGHT — Results */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && !analysis && (
          <Card className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Analyse en cours...</span>
            </div>
          </Card>
        )}

        {analysis && (
          <>
            {/* Action bar */}
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.97] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copié" : "Copier"}
              </button>
              <span className="ml-auto rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {VERIFY_TYPE_CONFIG[type].label} · {VERIFY_DEPTH_CONFIG[depth].label}
              </span>
            </div>

            {/* Structured result */}
            <VerificationResult content={analysis} />

            <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
              Analyse automatique — ne remplace pas un avis juridique professionnel.
            </p>
          </>
        )}

        {!analysis && !loading && !error && (
          <Card className="flex items-center justify-center py-16 lg:min-h-[400px]">
            <div className="flex flex-col items-center gap-3 text-center">
              <ShieldCheck className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Résultat de la vérification</p>
                <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-600">Collez votre contenu et lancez la vérification.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Structured result renderer
// ============================================================

function VerificationResult({ content }: { content: string }) {
  const sections = content.split(/^## /m).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const [titleLine, ...bodyParts] = section.split("\n");
        const body = bodyParts.join("\n").trim();
        const style = getSectionStyle(titleLine);
        const isDiagnostic = titleLine.toLowerCase().includes("diagnostic");
        const isRecommandation = titleLine.toLowerCase().includes("recommandation");

        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border border-l-[4px] p-5",
              style.border,
              style.bg,
              (isDiagnostic || isRecommandation) ? "border-zinc-200 shadow-sm dark:border-zinc-800" : "border-zinc-100 dark:border-zinc-800/50"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              {style.icon}
              <h3 className={cn("text-sm font-semibold", (isDiagnostic || isRecommandation) ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300")}>
                {titleLine.trim()}
              </h3>
            </div>
            <div>
              <MarkdownContent content={body} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HighlightedVerifyBody({ text }: { text: string }) {
  // Highlight risk badges
  const parts = text.split(/(🟢|🟡|🔴|✅|⚠️|🚫)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "🟢") return <span key={i} className="mx-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">🟢 CONFORME</span>;
        if (part === "🟡") return <span key={i} className="mx-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">🟡 SENSIBLE</span>;
        if (part === "🔴") return <span key={i} className="mx-0.5 rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">🔴 À CORRIGER</span>;
        if (part === "✅") return <span key={i} className="mx-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">✅ Utilisable</span>;
        if (part === "⚠️") return <span key={i} className="mx-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">⚠️ Après correction</span>;
        if (part === "🚫") return <span key={i} className="mx-0.5 rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">🚫 À revoir</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
