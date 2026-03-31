"use client";

import { useState } from "react";
import { APP_VERSION_LABEL } from "@/lib/version";
import { Send, CheckCircle, AlertCircle, MessageSquare, Bug, Lightbulb } from "lucide-react";

const feedbackTypes = [
  { value: "remark", label: "Remarque", icon: MessageSquare, color: "blue" },
  { value: "bug", label: "Bug", icon: Bug, color: "red" },
  { value: "improvement", label: "Amélioration", icon: Lightbulb, color: "amber" },
] as const;

export function FeedbackForm() {
  const [type, setType] = useState<string>("remark");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur inconnue" }));
        throw new Error(data.error);
      }

      setStatus("sent");
      setMessage("");
      setType("remark");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Merci pour votre retour !
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Votre feedback a bien été envoyé. Il sera pris en compte pour les prochaines versions.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Envoyer un autre feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Type selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Type de feedback
        </label>
        <div className="grid grid-cols-3 gap-3">
          {feedbackTypes.map((ft) => {
            const isActive = type === ft.value;
            const Icon = ft.icon;
            return (
              <button
                key={ft.value}
                type="button"
                onClick={() => setType(ft.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? ft.color === "blue"
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
                      : ft.color === "red"
                        ? "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-400"
                        : "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-400"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {ft.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Votre message
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            type === "bug"
              ? "Décrivez le problème rencontré, les étapes pour le reproduire..."
              : type === "improvement"
                ? "Quelle fonctionnalité aimeriez-vous voir ? Comment améliorer l'existant ?"
                : "Partagez vos remarques, suggestions ou observations..."
          }
          rows={5}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-400"
          required
          minLength={5}
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 dark:text-zinc-600">
          {APP_VERSION_LABEL}
        </span>
        <button
          type="submit"
          disabled={status === "sending" || message.trim().length < 5}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
