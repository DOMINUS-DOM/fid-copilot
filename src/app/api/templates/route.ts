import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type SavedTemplate, type TemplateSource, type TemplateCategory } from "@/types";

const VALID_SOURCES: TemplateSource[] = ["assistant", "decision", "generateur", "verification", "manuel"];
const VALID_CATEGORIES: TemplateCategory[] = ["courrier", "reponse", "convocation", "note", "procedure", "formulation", "autre"];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data, error } = await supabase
      .from("saved_templates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<SavedTemplate[]>();

    if (error) {
      console.error("[API templates GET]", error);
      return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }

    return NextResponse.json({ templates: data ?? [] });
  } catch (error) {
    console.error("[API /templates]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const title = body.title?.trim();
    const content = body.content?.trim();
    const source: TemplateSource = VALID_SOURCES.includes(body.source) ? body.source : "manuel";
    const category: TemplateCategory = VALID_CATEGORIES.includes(body.category) ? body.category : "autre";
    const tags: string[] = Array.isArray(body.tags) ? body.tags.slice(0, 5) : [];

    if (!title || !content) {
      return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("saved_templates")
      .insert({ user_id: user.id, title, content, source, category, tags: tags.length > 0 ? tags : null })
      .select()
      .single();

    if (error) {
      console.error("[API templates POST]", error);
      return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (error) {
    console.error("[API /templates POST]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
