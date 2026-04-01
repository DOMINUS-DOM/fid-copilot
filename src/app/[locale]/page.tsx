import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { DemoAnimations } from "@/components/landing/demo-animations";
import { Trust } from "@/components/landing/trust";
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
        <Features t={t.features} />
        <DemoAnimations />
        <Trust t={t.trust} />
        <CTA t={t.cta} />
      </main>
      <Footer t={t.footer} headerT={t.header} locale={locale as Locale} />
    </div>
  );
}
