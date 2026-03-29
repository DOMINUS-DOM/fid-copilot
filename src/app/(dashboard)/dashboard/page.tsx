import { createClient } from "@/lib/supabase/server";
import { type AssistantLog, type SchoolDocument } from "@/types";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? "";

  // Parallel fetches for performance
  const [logsResult, schoolResult, prefsResult, templatesResult, decisionsResult] = await Promise.all([
    supabase
      .from("assistant_logs")
      .select("id, question, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<AssistantLog[]>(),
    supabase
      .from("school_documents")
      .select("id, title, doc_type")
      .eq("user_id", userId)
      .returns<SchoolDocument[]>(),
    supabase
      .from("user_preferences")
      .select("first_name, school_name")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("saved_templates")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("decisions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return (
    <DashboardView
      firstName={prefsResult.data?.first_name ?? null}
      schoolName={prefsResult.data?.school_name ?? null}
      recentLogs={logsResult.data ?? []}
      schoolDocs={schoolResult.data ?? []}
      templateCount={templatesResult.count ?? 0}
      decisionCount={decisionsResult.count ?? 0}
    />
  );
}
