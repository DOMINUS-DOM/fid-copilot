import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { EuropeShowcase } from "@/components/europe/europe-showcase";

export const metadata = {
  title: "FID Copilot x Europe — AI-powered decision system for public administrations",
  description:
    "FID Copilot est une plateforme IA d'aide à la décision pour les administrations publiques. Analyse juridique, aide à la décision, conformité et traçabilité — aligné avec la transformation numérique européenne.",
};

export default async function EuropePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-1">
        <EuropeShowcase />
      </main>
      <Footer />
    </div>
  );
}
