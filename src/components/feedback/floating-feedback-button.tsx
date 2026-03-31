"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";

export function FloatingFeedbackButton() {
  const pathname = usePathname();

  // Don't show on the feedback page itself
  if (pathname === "/feedback") return null;

  return (
    <Link
      href="/feedback"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 sm:bottom-6 sm:right-6"
      aria-label="Donner mon avis"
    >
      <MessageSquare className="h-4 w-4" />
      <span className="hidden sm:inline">Feedback</span>
    </Link>
  );
}
