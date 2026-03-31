"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { APP_VERSION_LABEL } from "@/lib/version";
import { X, MessageSquare, Gift, ArrowRight } from "lucide-react";

const STORAGE_KEY = "fid-beta-welcome-seen";

export function WelcomeBetaModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show once per user (localStorage flag)
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so the dashboard loads first
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 px-8 pb-8 pt-8">
          <button
            onClick={dismiss}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <span className="text-2xl">{"👋"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {"Bienvenue dans FID Copilot !"}
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">{APP_VERSION_LABEL}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {"Vous faites partie des premiers directeurs à tester FID Copilot. Merci pour votre confiance ! Cette version bêta est en évolution constante, et "}
            <strong className="text-zinc-900 dark:text-white">{"votre avis est essentiel"}</strong>
            {" pour construire un outil qui répond vraiment à vos besoins quotidiens."}
          </p>

          {/* Highlights */}
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3.5 dark:bg-blue-900/20">
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {"Partagez vos retours"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {"Remarques, bugs, idées d'amélioration — chaque retour compte et sera lu attentivement par notre équipe."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3.5 dark:bg-amber-900/20">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {"Des avantages pour les contributeurs actifs"}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {"Les testeurs qui participent activement au développement bénéficieront d'avantages exclusifs sur les futures versions payantes."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-zinc-100 px-8 py-5 dark:border-zinc-800">
          <Link
            href="/feedback"
            onClick={dismiss}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            {"Donner mon premier avis"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={dismiss}
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {"Plus tard"}
          </button>
        </div>
      </div>
    </div>
  );
}
