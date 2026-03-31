import { type Metadata } from "next";
import { isValidLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Metadata {
  return {
    title: {
      default: "FID Copilot",
      template: "%s | FID Copilot",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return <>{children}</>;
}
