"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, ShieldAlert } from "lucide-react";
import { isPasswordLeaked } from "@/lib/password-check";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Vérification HaveIBeenPwned (k-anonymity)
    const leaked = await isPasswordLeaked(password);
    if (leaked) {
      setError("Ce mot de passe a été compromis dans une fuite de données connue. Veuillez en choisir un autre pour protéger votre compte.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
          <CheckCircle className="h-7 w-7 text-emerald-500" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Vérifiez votre boîte mail
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Un email de confirmation a été envoyé à <strong className="text-zinc-900 dark:text-white">{email}</strong>.
            Cliquez sur le lien pour activer votre compte.
          </p>
        </div>
        <div className="mt-1 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Si vous ne trouvez pas l'email, pensez à vérifier votre dossier <strong>spam</strong> ou <strong>courrier indésirable</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        label="Mot de passe"
        type="password"
        placeholder="Minimum 6 caractères"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={6}
        required
      />
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  );
}
