import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;

    // 1. Fetch the document (RLS ensures it belongs to user)
    const { data: doc, error: fetchError } = await supabase
      .from("school_documents")
      .select("id, file_path")
      .eq("id", id)
      .single();

    if (fetchError || !doc) {
      return NextResponse.json(
        { error: "Document non trouvé" },
        { status: 404 }
      );
    }

    // 2. Delete from Storage
    await supabase.storage.from("school-docs").remove([doc.file_path]);

    // 3. Delete from DB (cascades to school_chunks)
    const { error: deleteError } = await supabase
      .from("school_documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[API DELETE /school-docs]", deleteError);
      return NextResponse.json(
        { error: "Erreur lors de la suppression" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /school-docs/[id]]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
