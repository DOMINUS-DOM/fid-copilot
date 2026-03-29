import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      // Table may not exist yet — return defaults
      console.error("[API /preferences GET]", error.message);
      return NextResponse.json({ preferences: getDefaults(user.id) });
    }

    if (!data) {
      // No row yet — try to create one
      const { data: created, error: createErr } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createErr) {
        // Table doesn't exist or RLS issue — return defaults
        return NextResponse.json({ preferences: getDefaults(user.id) });
      }
      return NextResponse.json({ preferences: created });
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    console.error("[API /preferences GET]", error);
    return NextResponse.json({ preferences: getDefaults("") });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();

    const allowed: Record<string, unknown> = {};
    const fields = [
      "first_name", "last_name", "job_title", "school_name",
      "school_network", "school_level", "default_tone", "default_mode",
      "default_length", "signature", "closing_formula", "theme",
    ];
    for (const f of fields) {
      if (f in body) allowed[f] = body[f];
    }
    allowed.updated_at = new Date().toISOString();

    // Try upsert
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("user_preferences")
        .update(allowed)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) {
        console.error("[API /preferences PUT update]", error.message);
        return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
      }
      return NextResponse.json({ preferences: data });
    } else {
      const { data, error } = await supabase
        .from("user_preferences")
        .insert({ user_id: user.id, ...allowed })
        .select()
        .single();
      if (error) {
        console.error("[API /preferences PUT insert]", error.message);
        return NextResponse.json({ error: "Erreur création" }, { status: 500 });
      }
      return NextResponse.json({ preferences: data });
    }
  } catch (error) {
    console.error("[API /preferences PUT]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

function getDefaults(userId: string) {
  return {
    id: "",
    user_id: userId,
    first_name: null,
    last_name: null,
    job_title: null,
    school_name: null,
    school_network: null,
    school_level: null,
    default_tone: "neutre",
    default_mode: "terrain",
    default_length: "standard",
    signature: null,
    closing_formula: null,
    theme: "light",
    updated_at: new Date().toISOString(),
  };
}
