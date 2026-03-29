"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { type AssistantLog } from "@/types";
import {
  MessageSquare,
  Scale,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Clock,
  Filter,
  Copy,
  Check,
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
  created_at: string;
}

function parseLog(log: AssistantLog): ParsedLog {
  const q = log.question;
  if (q.startsWith("[decision]")) return { id: log.id, type: "decision", content: q.replace("[decision] ", ""), created_at: log.created_at };
  if (q.startsWith("[generate:")) return { id: log.id, type: "generateur", content: q.replace(/\[generate:[^\]]*\]\s*/, ""), created_at: log.created_at };
  if (q.startsWith("[verify:")) return { id: log.id, type: "verification", content: q.replace(/\[verify:[^\]]*\]\s*/, ""), created_at: log.created_at };
  if (q.startsWith("[portfolio:")) return { id: log.id, type: "portfolio", content: q.replace(/\[portfolio:[^\]]*\]\s*/, ""), created_at: log.created_at };
  return { id: log.id, type: "assistant", content: q, created_at: log.created_at };
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

interface HistoryViewProps {
  logs: AssistantLog[];
  error: boolean;
}

export function HistoryView({ logs, error }: HistoryViewProps) {
  const [filter, setFilter] = useState<LogType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const parsed = logs.map(parseLog);
  const filtered = filter === "all" ? parsed : parsed.filter((l) => l.type === filter);

  // Count by type
  const counts: Record<string, number> = { all: parsed.length };
  for (const l of parsed) counts[l.type] = (counts[l.type] || 0) + 1;

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        Erreur lors du chargement de l{"'"}historique.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-400" />
        <FilterButton label={`Tout (${counts.all})`} active={filter === "all"} onClick={() => setFilter("all")} />
        {(Object.keys(TYPE_CONFIG) as LogType[]).map((t) => {
          const count = counts[t] || 0;
          if (count === 0) return null;
          return (
            <FilterButton
              key={t}
              label={`${TYPE_CONFIG[t].label} (${count})`}
              active={filter === t}
              onClick={() => setFilter(filter === t ? "all" : t)}
            />
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              {logs.length === 0
                ? "Aucune activité pour le moment."
                : "Aucun élément dans cette catégorie."}
            </p>
            {logs.length === 0 && (
              <Link
                href="/assistant"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Poser une question
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((log) => {
            const cfg = TYPE_CONFIG[log.type];
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 transition-shadow hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className={cn("mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", cfg.color)}>
                  {cfg.icon}
                  {cfg.label}
                </span>
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {log.content.length > 200 ? log.content.slice(0, 200) + "..." : log.content}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleCopy(log.id, log.content)}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title="Copier"
                  >
                    {copiedId === log.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                    {new Date(log.created_at).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            );
          })}
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
            {filtered.length} élément{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
            {filter !== "all" ? ` sur ${parsed.length} total` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
        active
          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      )}
    >
      {label}
    </button>
  );
}
