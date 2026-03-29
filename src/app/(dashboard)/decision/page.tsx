import { DecisionEngine } from "@/components/decision/decision-engine";

export default function DecisionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Aide à la décision
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Décrivez votre situation. Recevez des options, une recommandation et un plan d'action.
      </p>
      <div className="mt-6">
        <DecisionEngine />
      </div>
    </div>
  );
}
