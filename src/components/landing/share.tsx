"use client";

import { motion } from "framer-motion";
import { Send, Copy, Check, Users } from "lucide-react";
import { useState } from "react";

export function Share() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://fidcopilot.be";

  function handleCopy() {
    navigator.clipboard.writeText(`FID Copilot — Assistant juridique pour directions d'école en FWB. Essayez gratuitement : ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleEmail() {
    const subject = encodeURIComponent("Un outil qui pourrait t'intéresser — FID Copilot");
    const body = encodeURIComponent(`Bonjour,\n\nJe te partage FID Copilot, un assistant juridique conçu pour les directions d'école en FWB et la formation FID.\n\nTu peux l'essayer gratuitement ici : ${shareUrl}\n\nBonne découverte !`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <section className="px-6 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 text-center sm:p-10"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600">
          <Users className="h-6 w-6" />
        </div>
        <p className="mt-5 text-lg font-semibold text-slate-900">
          Vous connaissez un(e) collègue que cela pourrait aider ?
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Partagez FID Copilot avec une direction ou un futur directeur en formation.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={handleEmail}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md active:scale-[0.97]"
          >
            <Send className="h-4 w-4 text-blue-500" />
            Envoyer par email
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md active:scale-[0.97]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
