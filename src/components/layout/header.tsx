"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <span className="text-lg font-bold text-slate-900">
            FID Copilot
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <a href="#demo" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            Démo
          </a>
          {isAuthenticated ? (
            <>
              <Link
                href="/assistant"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
              >
                Ouvrir l&apos;application
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
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
          className="sm:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#demo"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-600"
            >
              Démo
            </a>
            {isAuthenticated ? (
              <>
                <Link href="/assistant" className="text-sm font-medium text-slate-600">
                  Ouvrir l&apos;application
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600">
                  Connexion
                </Link>
                <Link
                  href="/signup"
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
