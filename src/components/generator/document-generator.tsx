"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  type DocGenCategory,
  type DocGenTone,
  type DocGenFormat,
  DOC_GEN_TEMPLATES,
  DOC_GEN_TONE_LABELS,
  DOC_GEN_FORMAT_LABELS,
  DOC_GEN_CATEGORY_LABELS,
} from "@/types";
import {
  FileText,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// ============================================================
// Group templates by category
// ============================================================

const templatesByCategory = Object.entries(DOC_GEN_TEMPLATES).reduce(
  (acc, [key, val]) => {
    if (!acc[val.category]) acc[val.category] = [];
    acc[val.category].push({ key, ...val });
    return acc;
  },
  {} as Record<DocGenCategory, { key: string; label: string; description: string }[]>
);

// ============================================================
// Main component
// ============================================================

export function DocumentGenerator() {
  // Form state
  const [template, setTemplate] = useState("");
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState<DocGenTone>("neutre");
  const [format, setFormat] = useState<DocGenFormat>("email");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [includePoints, setIncludePoints] = useState("");
  const [avoidPoints, setAvoidPoints] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Result state
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!situation.trim() || situation.trim().length < 10) return;

    setError("");
    setContent("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: template || "document libre",
          situation: situation.trim(),
          tone,
          format,
          recipient: recipient.trim() || undefined,
          subject: subject.trim() || undefined,
          includePoints: includePoints.trim() || undefined,
          avoidPoints: avoidPoints.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la génération");
        return;
      }
      setContent(data.content);
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRegenerate() {
    handleGenerate();
  }

  const hasEnoughText = situation.trim().length >= 10;
  const selectedTemplate = template ? DOC_GEN_TEMPLATES[template] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ============================================================ */}
      {/* LEFT — Configuration */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-5">
        {/* Template selector */}
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Type de document
          </p>
          <div className="flex flex-col gap-4">
            {(Object.keys(DOC_GEN_CATEGORY_LABELS) as DocGenCategory[]).map((cat) => (
              <div key={cat}>
                <p className="mb-1.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-600">
                  {DOC_GEN_CATEGORY_LABELS[cat]}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {templatesByCategory[cat]?.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTemplate(template === t.key ? "" : t.key)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs transition-all",
                        template === t.key
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                          : "border-zinc-100 bg-zinc-50/50 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-400 dark:hover:border-zinc-700"
                      )}
                    >
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Situation */}
        <Card>
          <label htmlFor="gen-situation" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Situation / Contexte
          </label>
          <textarea
            id="gen-situation"
            rows={4}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder={selectedTemplate
              ? `Décrivez la situation pour : ${selectedTemplate.label.toLowerCase()}...`
              : "Décrivez la situation qui nécessite ce document..."}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </Card>

        {/* Tone + Format */}
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">Ton</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(DOC_GEN_TONE_LABELS) as DocGenTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      tone === t
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                    )}
                  >
                    {DOC_GEN_TONE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">Format</p>
              <div className="flex flex-col gap-1.5">
                {(Object.keys(DOC_GEN_FORMAT_LABELS) as DocGenFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all",
                      format === f
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                    )}
                  >
                    {DOC_GEN_FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced options toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 self-start text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Options avancées
        </button>

        {showAdvanced && (
          <Card>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Destinataire</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Ex : Parents de [NOM]"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Objet</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex : Convocation entretien"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Points à inclure</label>
                <textarea
                  rows={2}
                  value={includePoints}
                  onChange={(e) => setIncludePoints(e.target.value)}
                  placeholder="Ex : mentionner le ROI, rappeler l'obligation scolaire..."
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Points à éviter</label>
                <textarea
                  rows={2}
                  value={avoidPoints}
                  onChange={(e) => setAvoidPoints(e.target.value)}
                  placeholder="Ex : ne pas mentionner la sanction, rester discret sur..."
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Generate button */}
        <Button
          onClick={() => handleGenerate()}
          disabled={loading || !hasEnoughText}
          className="self-start"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer le document
            </>
          )}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* RIGHT — Generated document */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {loading && !content && (
          <Card className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Rédaction en cours...</span>
            </div>
          </Card>
        )}

        {content && (
          <>
            {/* Action bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.97] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copié" : "Copier"}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 active:scale-[0.97] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Régénérer
              </button>
              {selectedTemplate && (
                <span className="ml-auto rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                  {selectedTemplate.label}
                </span>
              )}
            </div>

            {/* Document output */}
            <Card className="relative">
              <div className="absolute right-4 top-4">
                <FileText className="h-4 w-4 text-zinc-200 dark:text-zinc-700" />
              </div>
              <div className="pr-8">
                <MarkdownContent content={content} />
              </div>
            </Card>

            {/* Disclaimer */}
            <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
              Document généré par IA — à relire et adapter avant envoi. Aucune valeur juridique contraignante.
            </p>
          </>
        )}

        {!content && !loading && !error && (
          <Card className="flex items-center justify-center py-16 lg:min-h-[400px]">
            <div className="flex flex-col items-center gap-3 text-center">
              <FileText className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
              <div>
                <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                  Votre document apparaîtra ici
                </p>
                <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-600">
                  Choisissez un type, décrivez la situation, et générez.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
