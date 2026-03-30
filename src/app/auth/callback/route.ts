import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback — handles email confirmation + OAuth redirects.
 *
 * Supabase sends the user here with either:
 *   ?code=...            (PKCE flow — email confirm, magic link, OAuth)
 *   ?token_hash=...&type=... (older token-based flow)
 *
 * After exchanging the code for a session, redirects to /dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // PKCE flow (modern — email confirm, OAuth, magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[Auth callback] Code exchange error:", error.message);
  }

  // Token hash flow (legacy fallback)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "recovery" | "email",
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[Auth callback] Token verification error:", error.message);
  }

  // Error: redirect to login with error message
  return NextResponse.redirect(
    `${origin}/login?error=confirmation_failed`
  );
}
