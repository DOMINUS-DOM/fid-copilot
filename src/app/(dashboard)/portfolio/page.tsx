import { PortfolioWorkspace } from "@/components/portfolio/portfolio-workspace";

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Portfolio
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Structurez, améliorez et approfondissez votre réflexion professionnelle.
      </p>
      <div className="mt-6">
        <PortfolioWorkspace />
      </div>
    </div>
  );
}
