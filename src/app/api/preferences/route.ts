import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type UserPreferences } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .returns<UserPreferences>();

    if (!data) {
      // Create default preferences
      const { data: created } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id })
        .select()
        .single();
      return NextResponse.json({ preferences: created });
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    console.error("[API /preferences GET]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();

    // Whitelist fields
    const allowed: Record<string, unknown> = {};
    const fields = [
      "first_name", "last_name", "job_title", "school_name",
      "school_network", "school_level", "default_tone", "default_mode",
      "default_length", "signature", "closing_formula",
    ];
    for (const f of fields) {
      if (f in body) allowed[f] = body[f];
    }
    allowed.updated_at = new Date().toISOString();

    // Upsert
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("user_preferences")
        .update(allowed)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
      return NextResponse.json({ preferences: data });
    } else {
      const { data, error } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id, ...allowed })
        .select()
        .single();
      if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });
      return NextResponse.json({ preferences: data });
    }
  } catch (error) {
    console.error("[API /preferences PUT]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
