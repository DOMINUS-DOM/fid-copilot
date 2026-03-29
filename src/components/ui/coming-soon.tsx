"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeaturePreview {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ComingSoonProps {
  title: string;
  description: string;
  features: FeaturePreview[];
  accentColor?: string;
}

export function ComingSoon({
  title,
  description,
  features,
  accentColor = "blue",
}: ComingSoonProps) {
  const colorMap: Record<string, { badge: string; iconBg: string; iconText: string }> = {
    blue: { badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400", iconBg: "bg-blue-50 dark:bg-blue-950/30", iconText: "text-blue-600 dark:text-blue-400" },
    violet: { badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400", iconBg: "bg-violet-50 dark:bg-violet-950/30", iconText: "text-violet-600 dark:text-violet-400" },
    amber: { badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400", iconBg: "bg-amber-50 dark:bg-amber-950/30", iconText: "text-amber-600 dark:text-amber-400" },
    emerald: { badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400", iconBg: "bg-emerald-50 dark:bg-emerald-950/30", iconText: "text-emerald-600 dark:text-emerald-400" },
  };

  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="flex flex-col gap-6">
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", colors.badge)}>
          <span className="relative flex h-2 w-2">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", colors.iconText.replace("text-", "bg-"))} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", colors.iconText.replace("text-", "bg-"))} />
          </span>
          En développement
        </span>
      </div>

      {/* Description */}
      <Card className="border-dashed">
        <div className="flex flex-col items-center py-4 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            Cette section sera bientôt disponible.
          </p>
        </div>
      </Card>

      {/* Feature previews */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Fonctionnalités prévues
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30"
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", colors.iconBg)}>
                <span className={colors.iconText}>{feature.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{feature.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
