import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Inscription</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Créez votre compte FID Copilot
          </p>
        </div>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-white">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
}
