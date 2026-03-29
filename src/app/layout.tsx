import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FID Copilot — Assistant juridique pour directions d'école",
    template: "%s | FID Copilot",
  },
  description:
    "Assistant IA juridique pour directions d'école en Fédération Wallonie-Bruxelles. Aide à la décision, citations exactes, préparation FID. Toujours à jour avec les derniers textes légaux.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: "https://fidcopilot.be",
    siteName: "FID Copilot",
    title: "FID Copilot — Assistant juridique pour directions d'école",
    description:
      "Droit scolaire, aide à la décision, préparation FID — fondé sur les décrets et le Code de l'enseignement en vigueur. Citations exactes. Aucune hallucination.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FID Copilot — Assistant juridique IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FID Copilot — Assistant juridique pour directions d'école",
    description:
      "Droit scolaire, aide à la décision, préparation FID — citations exactes, sources officielles.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Prevent flash: apply dark class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('fid-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
