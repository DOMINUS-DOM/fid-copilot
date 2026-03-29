"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Scale,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Users,
  Building2,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Lightbulb,
} from "lucide-react";

interface DashboardProps {
  firstName: string | null;
  schoolName: string | null;
  recentLogs: { id: string; question: string; created_at: string }[];
  schoolDocs: { id: string; title: string; doc_type: string }[];
  templateCount?: number;
  decisionCount?: number;
}

// ============================================================
// Quick actions
// ============================================================

const quickActions = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Poser une question",
    description: "Assistant juridique",
    href: "/assistant",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Aide à la décision",
    description: "Options, risques, plan",
    href: "/decision",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Générer un document",
    description: "Courrier, convocation, note",
    href: "/generateur",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Vérifier un contenu",
    description: "Conformité, risques",
    href: "/verification",
    color: "from-amber-500 to-amber-600",
  },
];

// ============================================================
// All modules
// ============================================================

const modules = [
  { icon: <MessageSquare className="h-4 w-4" />, label: "Assistant", href: "/assistant", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
  { icon: <Scale className="h-4 w-4" />, label: "Décision", href: "/decision", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { icon: <Sparkles className="h-4 w-4" />, label: "Générateur", href: "/generateur", color: "text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400" },
  { icon: <ShieldCheck className="h-4 w-4" />, label: "Vérification", href: "/verification", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400" },
  { icon: <BookOpen className="h-4 w-4" />, label: "Portfolio", href: "/portfolio", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { icon: <Users className="h-4 w-4" />, label: "Équipe", href: "/equipe", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { icon: <Building2 className="h-4 w-4" />, label: "Mon école", href: "/mon-ecole", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400" },
  { icon: <Settings className="h-4 w-4" />, label: "Paramètres", href: "/parametres", color: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400" },
];

// ============================================================
// Component
// ============================================================

export function DashboardView({ firstName, schoolName, recentLogs, schoolDocs, templateCount = 0, decisionCount = 0 }: DashboardProps) {
  const greeting = firstName ? `Bonjour ${firstName}` : "Bienvenue";
  const hasRoi = schoolDocs.some((d) => d.doc_type === "roi");
  const hasReglement = schoolDocs.some((d) => d.doc_type === "reglement_etudes");

  // Smart tips
  const tips: { text: string; href: string }[] = [];
  if (schoolDocs.length === 0) tips.push({ text: "Uploadez le ROI de votre école pour contextualiser les réponses.", href: "/mon-ecole" });
  else if (!hasRoi) tips.push({ text: "Ajoutez votre ROI pour améliorer la précision juridique.", href: "/mon-ecole" });
  if (recentLogs.length === 0) tips.push({ text: "Posez votre première question à l'assistant juridique.", href: "/assistant" });
  if (tips.length === 0) tips.push({ text: "Essayez le moteur de décision pour analyser une situation concrète.", href: "/decision" });

  return (
    <div className="flex flex-col gap-8">
      {/* ============================================================ */}
      {/* Header */}
      {/* ============================================================ */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {schoolName
            ? `${schoolName} — Analysez, décidez, rédigez et sécurisez vos actions.`
            : "Votre espace pour analyser, décider, rédiger et sécuriser vos actions de direction."}
        </p>
      </div>

      {/* ============================================================ */}
      {/* Quick actions */}
      {/* ============================================================ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition-all hover:border-zinc-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm`}>
              {action.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{action.title}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{action.description}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600" />
          </Link>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Stats */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Analyses" value={recentLogs.length > 0 ? `${recentLogs.length}+` : "0"} icon={<MessageSquare className="h-4 w-4" />} color="text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard label="Décisions" value={String(decisionCount)} icon={<Scale className="h-4 w-4" />} color="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400" />
        <StatCard label="Modèles" value={String(templateCount)} icon={<Sparkles className="h-4 w-4" />} color="text-violet-600 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400" />
        <StatCard label="Docs école" value={String(schoolDocs.length)} icon={<Building2 className="h-4 w-4" />} color="text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400" />
      </div>

      {/* ============================================================ */}
      {/* Middle: School status + Tips */}
      {/* ============================================================ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* School status */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Mon école</h2>
            </div>
            <Link href="/mon-ecole" className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Gérer →
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <StatusRow label="ROI" present={hasRoi} />
            <StatusRow label="Règlement des études" present={hasReglement} />
            <StatusRow label="Autres documents" present={schoolDocs.length > (hasRoi ? 1 : 0) + (hasReglement ? 1 : 0)} count={Math.max(0, schoolDocs.length - (hasRoi ? 1 : 0) - (hasReglement ? 1 : 0))} />
          </div>
          {schoolDocs.length === 0 && (
            <Link
              href="/mon-ecole"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              <Upload className="h-3.5 w-3.5" />
              Uploader un document
            </Link>
          )}
        </Card>

        {/* Tips */}
        <Card>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Prochaine étape</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {tips.map((tip, i) => (
              <Link
                key={i}
                href={tip.href}
                className="flex items-start gap-3 rounded-xl bg-amber-50/50 px-4 py-3 transition-colors hover:bg-amber-50 dark:bg-amber-900/10 dark:hover:bg-amber-900/20"
              >
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-800 dark:text-amber-300">{tip.text}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* Recent activity */}
      {/* ============================================================ */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Activité récente</h2>
          </div>
          {recentLogs.length > 0 && (
            <Link href="/history" className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Tout voir →
            </Link>
          )}
        </div>

        {recentLogs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentLogs.map((log) => {
              const isDecision = log.question.startsWith("[decision]");
              const isGenerate = log.question.startsWith("[generate:");
              const isVerify = log.question.startsWith("[verify:");
              const isPortfolio = log.question.startsWith("[portfolio:");

              let label = "Assistant";
              let color = "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
              let cleanQ = log.question;

              if (isDecision) { label = "Décision"; color = "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"; cleanQ = log.question.replace("[decision] ", ""); }
              if (isGenerate) { label = "Générateur"; color = "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"; cleanQ = log.question.replace(/\[generate:[^\]]*\]\s*/, ""); }
              if (isVerify) { label = "Vérification"; color = "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"; cleanQ = log.question.replace(/\[verify:[^\]]*\]\s*/, ""); }
              if (isPortfolio) { label = "Portfolio"; color = "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"; cleanQ = log.question.replace(/\[portfolio:[^\]]*\]\s*/, ""); }

              return (
                <div key={log.id} className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                  <span className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${color}`}>
                    {label}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {cleanQ.slice(0, 120)}
                  </p>
                  <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-600">
                    {new Date(log.created_at).toLocaleDateString("fr-BE", { day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-700" />
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Aucune activité récente</p>
              <Link
                href="/assistant"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Poser une question
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* ============================================================ */}
      {/* All modules grid */}
      {/* ============================================================ */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Tous les modules
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 transition-all hover:border-zinc-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${m.color}`}>
                {m.icon}
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}

function StatusRow({ label, present, count }: { label: string; present: boolean; count?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
      {present ? (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-3.5 w-3.5" />
          {count !== undefined && count > 0 ? `${count} doc${count > 1 ? "s" : ""}` : "Présent"}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          Manquant
        </span>
      )}
    </div>
  );
}
