import { createClient } from "@/lib/supabase/server";
import { type AssistantLog } from "@/types";
import { Card } from "@/components/ui/card";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assistant_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<AssistantLog[]>();

  const logs = data ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Historique
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Vos dernières questions posées à l&apos;assistant.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Erreur lors du chargement de l&apos;historique.
        </div>
      ) : logs.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aucune question posée pour le moment. Rendez-vous sur l&apos;assistant pour commencer.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <Card key={log.id} className="flex flex-col gap-1.5 py-4">
              <p className="text-sm text-zinc-900 dark:text-white">
                {log.question}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                {formatDate(log.created_at)}
              </p>
            </Card>
          ))}
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            {logs.length} question{logs.length > 1 ? "s" : ""} affichée{logs.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
