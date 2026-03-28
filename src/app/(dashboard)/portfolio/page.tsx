import { Card } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Portfolio</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Suivez et présentez vos réalisations.
      </p>
      <Card className="mt-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Votre portfolio est vide. Ajoutez votre première réalisation.
        </p>
      </Card>
    </div>
  );
}
