import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HeroNarrative } from "@/components/landing/hero-narrative";
import { DemoAssistant } from "@/components/landing/demo-animations";
import { Trust } from "@/components/landing/trust";
import { DemoDocument } from "@/components/landing/demo-document";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { getMessages, isValidLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = await getMessages(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} locale={locale as Locale} t={t.header} />
      <main className="flex-1">
        <Hero isAuthenticated={isAuthenticated} t={t.hero} locale={locale} />
        <HeroNarrative t={t.narrative} />
        <Features t={t.features} />
        <DemoAssistant t={t.demoAssistant} />
        <Trust t={t.trust} />
        <DemoDocument t={t.demoDocument} />
        <CTA t={t.cta} />
      </main>
      <Footer t={t.footer} headerT={t.header} locale={locale as Locale} />
    </div>
  );
}
