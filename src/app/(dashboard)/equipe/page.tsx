import { SharingWorkspace } from "@/components/sharing/sharing-workspace";

export default function EquipePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Équipe & Partage
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Conservez vos modèles, partagez vos analyses et exportez vos documents.
      </p>
      <div className="mt-6">
        <SharingWorkspace />
      </div>
    </div>
  );
}
