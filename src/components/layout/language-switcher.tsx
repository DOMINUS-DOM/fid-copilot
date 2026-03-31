"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Build the path for a different locale
  function getLocalePath(targetLocale: Locale) {
    // Current path is like /fr/pricing or /en/guide
    // Replace the first segment with the new locale
    const segments = pathname.split("/").filter(Boolean);
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }
    return "/" + segments.join("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Changer de langue"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale].slice(0, 2).toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={getLocalePath(l)}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                l === locale
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {LOCALE_LABELS[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
