import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/landing/footer";
import { getMessages, isValidLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

// Keep europe showcase as-is (heavy component) — it reads from the locale messages
import { EuropeShowcase } from "@/components/europe/europe-showcase";

export default async function EuropePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const msgs = await getMessages(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} locale={locale as Locale} t={msgs.header} />
      <main className="flex-1">
        <EuropeShowcase t={msgs.europe} />
      </main>
      <Footer t={msgs.footer} headerT={msgs.header} locale={locale as Locale} />
    </div>
  );
}
