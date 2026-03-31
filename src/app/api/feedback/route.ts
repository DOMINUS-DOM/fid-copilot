import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_VERSION, APP_STAGE } from "@/lib/version";

export async function POST(request: Request) {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // 2. Parse body
  const body = await request.json();
  const { type, message } = body as { type: string; message: string };

  if (!message || message.trim().length < 5) {
    return NextResponse.json(
      { error: "Le message doit contenir au moins 5 caractères." },
      { status: 400 }
    );
  }

  // 3. Build email
  const userEmail = user.email ?? "inconnu";
  const subject = `[FID Copilot ${APP_STAGE} ${APP_VERSION}] Feedback de ${userEmail}`;

  const typeLabel =
    type === "bug"
      ? "Signalement de bug"
      : type === "improvement"
        ? "Piste d'amélioration"
        : "Remarque générale";

  const htmlBody = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:20px 24px;border-radius:12px 12px 0 0;">
        <h2 style="margin:0;color:#fff;font-size:18px;">FID Copilot — Feedback ${APP_STAGE}</h2>
      </div>
      <div style="border:1px solid #e4e4e7;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="padding:6px 0;color:#71717a;font-size:13px;width:120px;">Version</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;">${APP_STAGE} ${APP_VERSION}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#71717a;font-size:13px;">Utilisateur</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;">${userEmail}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#71717a;font-size:13px;">Type</td>
            <td style="padding:6px 0;font-size:13px;font-weight:600;">${typeLabel}</td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;" />
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;color:#18181b;">
          ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </div>
      </div>
    </div>
  `;

  // 4. Send via Resend API
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[Feedback] RESEND_API_KEY not set");
    return NextResponse.json(
      { error: "Configuration email manquante" },
      { status: 500 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "FID Copilot <no-reply@fid-copilot.com>",
      to: ["info@conceptus.be"],
      subject,
      html: htmlBody,
      reply_to: userEmail,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Feedback] Resend error:", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer le feedback" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
