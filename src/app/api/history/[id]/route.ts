import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// PATCH — update rating (thumbs up/down) on a log entry
// ============================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { rating } = body;

    if (rating !== "up" && rating !== "down" && rating !== null) {
      return NextResponse.json({ error: "Rating invalide" }, { status: 400 });
    }

    const { error } = await supabase
      .from("assistant_logs")
      .update({ rating })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[API history PATCH]", error);
      return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ success: true, rating });
  } catch (error) {
    console.error("[API /history/[id] PATCH]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ============================================================
// DELETE — remove a log entry
// ============================================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;

    // Delete from assistant_logs
    const { error } = await supabase
      .from("assistant_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[API history DELETE]", error);
      return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
    }

    // Also delete any matching decision (linked via the log question prefix)
    // Decisions are stored separately — clean them up too
    await supabase
      .from("decisions")
      .delete()
      .eq("user_id", user.id)
      .eq("id", id)
      .then(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /history/[id]]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
