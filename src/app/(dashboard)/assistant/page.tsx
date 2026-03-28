import { AssistantChat } from "@/components/assistant/assistant-chat";
import { TrialBanner } from "@/components/ui/trial-banner";

export default function AssistantPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Assistant FID
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Posez une question juridique et obtenez une réponse structurée avec
          base légale et sources officielles.
        </p>
      </div>
      <TrialBanner />
      <AssistantChat />
    </div>
  );
}
