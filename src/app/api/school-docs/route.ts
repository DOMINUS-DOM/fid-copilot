import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type SchoolDocument } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data: documents, error } = await supabase
      .from("school_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<SchoolDocument[]>();

    if (error) {
      console.error("[API /school-docs GET]", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération" },
        { status: 500 }
      );
    }

    return NextResponse.json({ documents: documents ?? [] });
  } catch (error) {
    console.error("[API /school-docs]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
