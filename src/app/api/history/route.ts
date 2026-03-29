import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** DELETE multiple logs by IDs (batch) */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "Aucun ID fourni" }, { status: 400 });
    }

    const { error } = await supabase
      .from("assistant_logs")
      .delete()
      .in("id", ids)
      .eq("user_id", user.id);

    if (error) {
      console.error("[API history batch DELETE]", error);
      return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error) {
    console.error("[API /history batch]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
