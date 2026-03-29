"use client";

import { useEffect } from "react";

/**
 * Applique le thème sauvegardé (localStorage) au chargement.
 * Le choix est aussi persisté dans Supabase via /api/preferences,
 * mais localStorage permet un rendu instantané sans flash.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("fid-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}

/**
 * Utilitaire pour changer le thème depuis n'importe quel composant.
 */
export function setTheme(theme: "light" | "dark") {
  localStorage.setItem("fid-theme", theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
