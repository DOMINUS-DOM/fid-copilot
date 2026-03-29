import { SchoolDocsManager } from "@/components/school-docs/school-docs-manager";

export default function MonEcolePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Mon école
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Documents internes de votre établissement pour contextualiser l&apos;assistant.
      </p>
      <div className="mt-6">
        <SchoolDocsManager />
      </div>
    </div>
  );
}
