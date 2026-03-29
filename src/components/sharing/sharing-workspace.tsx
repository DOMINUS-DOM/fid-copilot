"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type SavedTemplate,
  type TemplateSource,
  type TemplateCategory,
  TEMPLATE_SOURCE_LABELS,
  TEMPLATE_CATEGORY_LABELS,
} from "@/types";
import {
  Plus,
  Loader2,
  Copy,
  Check,
  Trash2,
  Send,
  BookmarkPlus,
  FileText,
  MessageSquare,
  Scale,
  Sparkles,
  ShieldCheck,
  Archive,
  Filter,
} from "lucide-react";
import Link from "next/link";

// ============================================================
// Source icons
// ============================================================

const SOURCE_ICONS: Record<TemplateSource, React.ReactNode> = {
  assistant: <MessageSquare className="h-3.5 w-3.5" />,
  decision: <Scale className="h-3.5 w-3.5" />,
  generateur: <Sparkles className="h-3.5 w-3.5" />,
  verification: <ShieldCheck className="h-3.5 w-3.5" />,
  manuel: <FileText className="h-3.5 w-3.5" />,
};

const SOURCE_COLORS: Record<TemplateSource, string> = {
  assistant: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  decision: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  generateur: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  verification: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  manuel: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

// ============================================================
// Main
// ============================================================

export function SharingWorkspace() {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save form
  const [saveTitle, setSaveTitle] = useState("");
  const [saveContent, setSaveContent] = useState("");
  const [saveCategory, setSaveCategory] = useState<TemplateCategory>("autre");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (res.ok) setTemplates(data.templates);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!saveTitle.trim() || !saveContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: saveTitle.trim(), content: saveContent.trim(), source: "manuel", category: saveCategory }),
      });
      if (res.ok) {
        setSaveTitle("");
        setSaveContent("");
        setSaveCategory("autre");
        setShowSaveModal(false);
        fetchTemplates();
      }
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleEmail(title: string, content: string) {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  const filtered = filter === "all" ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-400" />
          <button onClick={() => setFilter("all")} className={cn("rounded-lg px-2.5 py-1 text-xs font-medium transition-all", filter === "all" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800")}>
            Tout ({templates.length})
          </button>
          {(Object.keys(TEMPLATE_CATEGORY_LABELS) as TemplateCategory[]).map((cat) => {
            const count = templates.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} onClick={() => setFilter(filter === cat ? "all" : cat)} className={cn("rounded-lg px-2.5 py-1 text-xs font-medium transition-all", filter === cat ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800")}>
                {TEMPLATE_CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>

        {/* Add button */}
        <Button onClick={() => setShowSaveModal(true)} className="self-start sm:self-auto">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouveau modèle
        </Button>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-900/40 dark:bg-blue-950/10">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Enregistrer un modèle</h3>
            <input type="text" value={saveTitle} onChange={(e) => setSaveTitle(e.target.value)} placeholder="Titre du modèle" className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
            <textarea rows={5} value={saveContent} onChange={(e) => setSaveContent(e.target.value)} placeholder="Collez ici le contenu à sauvegarder..." className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">Catégorie</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TEMPLATE_CATEGORY_LABELS) as TemplateCategory[]).map((cat) => (
                  <button key={cat} type="button" onClick={() => setSaveCategory(cat)} className={cn("rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all", saveCategory === cat ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400")}>
                    {TEMPLATE_CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || !saveTitle.trim() || !saveContent.trim()}>
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <BookmarkPlus className="mr-1.5 h-4 w-4" />}
                Enregistrer
              </Button>
              <Button variant="secondary" onClick={() => setShowSaveModal(false)}>Annuler</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && templates.length === 0 && (
        <Card className="py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <Archive className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Votre bibliothèque est vide</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Enregistrez des modèles depuis vos analyses ou créez-en manuellement.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/assistant" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <MessageSquare className="h-3.5 w-3.5" /> Assistant
              </Link>
              <Link href="/generateur" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <Sparkles className="h-3.5 w-3.5" /> Générateur
              </Link>
              <Link href="/verification" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Vérification
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Template grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((tpl) => (
            <div key={tpl.id} className="flex flex-col rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              {/* Header */}
              <div className="flex items-start gap-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", SOURCE_COLORS[tpl.source])}>
                  {SOURCE_ICONS[tpl.source]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{tpl.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {TEMPLATE_CATEGORY_LABELS[tpl.category]}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(tpl.created_at).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="flex-1 px-4 py-3">
                <p className="line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {tpl.content.slice(0, 200)}{tpl.content.length > 200 ? "..." : ""}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 border-t border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
                <button onClick={() => handleCopy(tpl.id, tpl.content)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  {copiedId === tpl.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copiedId === tpl.id ? "Copié" : "Copier"}
                </button>
                <button onClick={() => handleEmail(tpl.title, tpl.content)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                  <Send className="h-3 w-3" /> Email
                </button>
                <div className="flex-1" />
                <button onClick={() => handleDelete(tpl.id, tpl.title)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && templates.length > 0 && filtered.length === 0 && (
        <Card className="py-8">
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
            Aucun modèle dans cette catégorie.
          </p>
        </Card>
      )}
    </div>
  );
}
