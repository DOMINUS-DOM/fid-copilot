import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Connexion</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Accédez à votre espace FID Copilot
          </p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-zinc-900 hover:underline dark:text-white">
            S'inscrire
          </Link>
        </p>
      </Card>
    </div>
  );
}
