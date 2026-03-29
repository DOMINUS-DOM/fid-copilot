import { DocumentGenerator } from "@/components/generator/document-generator";

export default function GenerateurPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Générateur de documents
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Courriers, convocations, réponses formelles — rédigés avec le bon ton et le bon cadre.
      </p>
      <div className="mt-6">
        <DocumentGenerator />
      </div>
    </div>
  );
}
