import { createClient } from "@/lib/supabase/server";
import { type Document } from "@/types";
import { DocumentsList } from "@/components/documents/documents-list";
import { TrialBanner } from "@/components/ui/trial-banner";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("is_core", { ascending: false })
    .order("title", { ascending: true })
    .returns<Document[]>();

  const documents = data ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Documents
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Textes de référence et ressources de la formation FID.
        </p>
      </div>

      <TrialBanner />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Erreur lors du chargement des documents. Vérifiez la configuration Supabase.
        </div>
      ) : (
        <DocumentsList documents={documents} />
      )}
    </div>
  );
}
