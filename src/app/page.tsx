import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Solution } from "@/components/landing/solution";
import { Screenshots } from "@/components/landing/screenshots";
import { Demo } from "@/components/landing/demo";
import { Benefits } from "@/components/landing/benefits";
import { UseCases } from "@/components/landing/use-cases";
import { Credibility } from "@/components/landing/credibility";
import { Pricing } from "@/components/landing/pricing";
import { Share } from "@/components/landing/share";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />
      <main className="flex-1">
        <Hero isAuthenticated={isAuthenticated} />
        <Problem />
        <Solution />
        <Screenshots />
        <Demo />
        <Benefits />
        <UseCases />
        <Credibility />
        <Pricing />
        <Share />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
