"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
}

const navLinks = [
  { label: "Découvrir", href: "/decouvrir" },
  { label: "Guide", href: "/guide" },
  { label: "Tarifs", href: "/pricing" },
  { label: "Europe", href: "/europe" },
];

export function Header({ isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="FID Copilot"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            FID <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Copilot</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                href="/assistant"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-blue-500/20 hover:brightness-110 active:scale-[0.97]"
              >
                {"Ouvrir l'application"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                Connexion
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-blue-500/20 hover:brightness-110 active:scale-[0.97]"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-600"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/assistant" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600">
                  {"Ouvrir l'application"}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-600">
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
