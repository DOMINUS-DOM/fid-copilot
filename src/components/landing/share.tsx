"use client";

import { motion } from "framer-motion";
import { Send, Copy, Check } from "lucide-react";
import { useState } from "react";

export function Share() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://fidcopilot.be";
  const shareText = "FID Copilot — Assistant juridique pour directions d'école en FWB. Essaie gratuitement :";

  function handleCopy() {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEmail() {
    const subject = encodeURIComponent("Un outil qui pourrait t'intéresser — FID Copilot");
    const body = encodeURIComponent(`Bonjour,\n\nJe te partage FID Copilot, un assistant juridique conçu pour les directions d'école en FWB et la formation FID.\n\nTu peux l'essayer gratuitement ici : ${shareUrl}\n\nBonne découverte !`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <section className="px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-slate-50/80 p-8 text-center sm:p-10"
      >
        <p className="text-lg font-semibold text-slate-900">
          Vous connaissez un(e) collègue que cela pourrait aider ?
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Partagez FID Copilot avec une direction ou un futur directeur en formation.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={handleEmail}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <Send className="h-4 w-4 text-blue-500" />
            Envoyer par email
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
