import { VerificationWorkspace } from "@/components/verification/verification-workspace";

export default function VerificationPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Vérification de conformité
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Contrôlez un document, un courrier ou une décision avant de l{"'"}utiliser.
      </p>
      <div className="mt-6">
        <VerificationWorkspace />
      </div>
    </div>
  );
}
