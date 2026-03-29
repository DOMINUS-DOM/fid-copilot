import { createClient } from "@/lib/supabase/server";
import { type AssistantLog } from "@/types";
import { HistoryView } from "@/components/history/history-view";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("assistant_logs")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<AssistantLog[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Historique
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Toutes vos analyses, décisions, documents et vérifications.
      </p>
      <div className="mt-6">
        <HistoryView logs={data ?? []} error={!!error} />
      </div>
    </div>
  );
}
