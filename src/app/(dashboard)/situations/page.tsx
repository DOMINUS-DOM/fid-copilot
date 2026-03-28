import { SituationsList } from "@/components/situations/situations-list";

export default function SituationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Situations de terrain
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Cas concrets rencontrés par les directions d&apos;école. Choisissez une
          situation pour obtenir une analyse juridique structurée.
        </p>
      </div>
      <SituationsList />
    </div>
  );
}
