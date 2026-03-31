import { FeedbackForm } from "@/components/feedback/feedback-form";
import { APP_VERSION_LABEL } from "@/lib/version";

export default function FeedbackPage() {
  return (
    <div className="py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Feedback
          </h1>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {APP_VERSION_LABEL}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {"Aidez-nous à améliorer FID Copilot ! Partagez vos remarques sur les fonctionnalités existantes ou proposez des pistes d'amélioration. Chaque retour compte."}
        </p>
      </div>

      <FeedbackForm />
    </div>
  );
}
