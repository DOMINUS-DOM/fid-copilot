import { SettingsWorkspace } from "@/components/settings/settings-workspace";

export default function ParametresPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Paramètres
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Profil, préférences et configuration de votre espace FID Copilot.
      </p>
      <div className="mt-6">
        <SettingsWorkspace />
      </div>
    </div>
  );
}
