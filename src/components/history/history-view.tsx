"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { type AssistantLog } from "@/types";
import {
  MessageSquare, Scale, Sparkles, ShieldCheck, BookOpen,
  Clock, Filter, Copy, Check, Trash2, BookmarkPlus,
  ChevronDown, ChevronUp, CheckSquare, Square, X,
} from "lucide-react";
import Link from "next/link";

// ============================================================
// Log type detection
// ============================================================

type LogType = "assistant" | "decision" | "generateur" | "verification" | "portfolio" | "autre";

interface ParsedLog {
  id: string;
  type: LogType;
  content: string;
  response: string | null;
  created_at: string;
}

function parseLog(log: AssistantLog): ParsedLog {
  const q = log.question;
  if (q.startsWith("[decision]")) return { id: log.id, type: "decision", content: q.replace("[decision] ", ""), response: log.response, created_at: log.created_at };
  if (q.startsWith("[generate:")) return { id: log.id, type: "generateur", content: q.replace(/\[generate:[^\]]*\]\s*/, ""), response: log.response, created_at: log.created_at };
  if (q.startsWith("[verify:")) return { id: log.id, type: "verification", content: q.replace(/\[verify:[^\]]*\]\s*/, ""), response: log.response, created_at: log.created_at };
  if (q.startsWith("[portfolio:")) return { id: log.id, type: "portfolio", content: q.replace(/\[portfolio:[^\]]*\]\s*/, ""), response: log.response, created_at: log.created_at };
  return { id: log.id, type: "assistant", content: q, response: log.response, created_at: log.created_at };
}

const TYPE_CONFIG: Record<LogType, { label: string; icon: React.ReactNode; color: string }> = {
  assistant: { label: "Assistant", icon: <MessageSquare className="h-3.5 w-3.5" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  decision: { label: "Décision", icon: <Scale className="h-3.5 w-3.5" />, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  generateur: { label: "Générateur", icon: <Sparkles className="h-3.5 w-3.5" />, color: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400" },
  verification: { label: "Vérification", icon: <ShieldCheck className="h-3.5 w-3.5" />, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  portfolio: { label: "Portfolio", icon: <BookOpen className="h-3.5 w-3.5" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  autre: { label: "Autre", icon: <Clock className="h-3.5 w-3.5" />, color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
};

// ============================================================
// Component
// ============================================================

export function HistoryView({ logs, error }: { logs: AssistantLog[]; error: boolean }) {
  const [filter, setFilter] = useState<LogType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Multi-select
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const parsed = logs.map(parseLog).filter((l) => !deletedIds.has(l.id));
  const filtered = filter === "all" ? parsed : parsed.filter((l) => l.type === filter);

  const counts: Record<string, number> = { all: parsed.length };
  for (const l of parsed) counts[l.type] = (counts[l.type] || 0) + 1;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((l) => l.id)));
    }
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`Supprimer ${selectedIds.size} élément${selectedIds.size > 1 ? "s" : ""} ?`)) return;
    setDeleting(true);
    const res = await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    if (res.ok) {
      setDeletedIds((prev) => {
        const next = new Set(prev);
        selectedIds.forEach((id) => next.add(id));
        return next;
      });
      exitSelectMode();
    }
    setDeleting(false);
  }

  async function handleSingleDelete(id: string) {
    const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
    if (res.ok) setDeletedIds((prev) => new Set(prev).add(id));
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSave(log: ParsedLog) {
    const fullContent = log.response
      ? `Question :\n${log.content}\n\nRéponse :\n${log.response}`
      : log.content;
    const title = `${TYPE_CONFIG[log.type].label} — ${log.content.slice(0, 50)}`;
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: fullContent, source: log.type === "autre" ? "manuel" : log.type, category: "autre" }),
    });
    if (res.ok) { setSavedId(log.id); setTimeout(() => setSavedId(null), 2500); }
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">Erreur lors du chargement.</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {selectMode ? (
          <>
            <button onClick={selectAll} className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">
              {selectedIds.size === filtered.length ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
            <span className="text-xs text-zinc-500">{selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}</span>
            <Button
              onClick={handleBatchDelete}
              disabled={selectedIds.size === 0 || deleting}
              variant="secondary"
              className="ml-auto text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Supprimer ({selectedIds.size})
            </Button>
            <button onClick={exitSelectMode} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <Filter className="h-4 w-4 text-zinc-400" />
            <FilterBtn label={`Tout (${counts.all})`} active={filter === "all"} onClick={() => setFilter("all")} />
            {(Object.keys(TYPE_CONFIG) as LogType[]).map((t) => {
              const c = counts[t] || 0;
              return c > 0 ? <FilterBtn key={t} label={`${TYPE_CONFIG[t].label} (${c})`} active={filter === t} onClick={() => setFilter(filter === t ? "all" : t)} /> : null;
            })}
            <button onClick={() => setSelectMode(true)} className="ml-auto rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <CheckSquare className="mr-1 inline h-3.5 w-3.5" />
              Sélectionner
            </button>
          </>
        )}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <Card className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400">{parsed.length === 0 ? "Aucune activité." : "Aucun élément dans cette catégorie."}</p>
            {parsed.length === 0 && (
              <Link href="/assistant" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <MessageSquare className="h-3.5 w-3.5" /> Poser une question
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* List */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          {filtered.map((log) => {
            const cfg = TYPE_CONFIG[log.type];
            const isExpanded = expandedId === log.id;
            const isSelected = selectedIds.has(log.id);
            const hasResponse = !!log.response;

            return (
              <div key={log.id} className={cn(
                "rounded-xl border bg-white transition-all dark:bg-zinc-900",
                isSelected ? "border-blue-300 bg-blue-50/30 dark:border-blue-700 dark:bg-blue-950/20" : "border-zinc-100 hover:shadow-sm dark:border-zinc-800"
              )}>
                {/* Header row */}
                <div className="flex items-start gap-2 px-4 py-3">
                  {/* Select checkbox */}
                  {selectMode && (
                    <button onClick={() => toggleSelect(log.id)} className="mt-0.5 shrink-0">
                      {isSelected
                        ? <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        : <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />}
                    </button>
                  )}

                  {/* Type badge */}
                  <span className={cn("mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", cfg.color)}>
                    {cfg.icon}{cfg.label}
                  </span>

                  {/* Content preview — only visible when collapsed */}
                  <button
                    onClick={() => !selectMode && setExpandedId(isExpanded ? null : log.id)}
                    className={cn(
                      "min-w-0 flex-1 text-left text-sm text-zinc-700 dark:text-zinc-300",
                      isExpanded && "hidden",
                      !isExpanded && "truncate",
                      !selectMode && "cursor-pointer hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {log.content}
                  </button>

                  {/* Actions */}
                  {!selectMode && (
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button onClick={() => setExpandedId(isExpanded ? null : log.id)} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" title={isExpanded ? "Réduire" : "Déplier"}>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => handleCopy(log.id, log.response || log.content)} className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Copier">
                        {copiedId === log.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => handleSave(log)} className="rounded p-1.5 text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20" title="Sauvegarder">
                        {savedId === log.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => handleSingleDelete(log.id)} className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Supprimer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-1 text-[11px] text-zinc-400 dark:text-zinc-600">
                        {new Date(log.created_at).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded: full question + response */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800">
                    {/* Full question */}
                    <div className="bg-blue-50/30 px-4 py-3 dark:bg-blue-950/10">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">Question complète</p>
                      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        <MarkdownContent content={log.content} />
                      </div>
                    </div>

                    {/* Full response */}
                    {log.response ? (
                      <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/20">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">Réponse complète</p>
                        <div className="max-h-[600px] overflow-y-auto">
                          <MarkdownContent content={log.response} />
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/20">
                        <p className="text-xs italic text-zinc-400">Réponse non disponible pour les anciens éléments.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <p className="mt-1 text-xs text-zinc-400">
            {filtered.length} élément{filtered.length > 1 ? "s" : ""}
            {filter !== "all" ? ` sur ${parsed.length}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("rounded-lg px-2.5 py-1 text-xs font-medium transition-all", active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800")}>
      {label}
    </button>
  );
}
