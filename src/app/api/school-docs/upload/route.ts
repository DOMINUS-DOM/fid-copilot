import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractAndChunk } from "@/lib/school-docs/chunker";
import { type SchoolDocType } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const VALID_TYPES: SchoolDocType[] = [
  "roi", "reglement_etudes", "projet_etablissement",
  "plan_pilotage", "note_interne", "autre",
];

export async function POST(request: Request) {
  try {
    // 1. Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié. Veuillez vous reconnecter." }, { status: 401 });
    }

    // 2. Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Erreur lors de la lecture du formulaire." }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim();
    const docType = formData.get("doc_type") as SchoolDocType;

    if (!file || !title || !docType) {
      return NextResponse.json({ error: "Fichier, titre et type de document requis." }, { status: 400 });
    }

    if (!VALID_TYPES.includes(docType)) {
      return NextResponse.json({ error: "Type de document invalide." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Le fichier fait ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum : 10 MB.` }, { status: 400 });
    }

    // 3. Read file buffer
    const docId = crypto.randomUUID();
    const filePath = `${user.id}/${docId}.pdf`;

    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (err) {
      console.error("[Upload buffer]", err);
      return NextResponse.json({ error: "Erreur lors de la lecture du fichier." }, { status: 500 });
    }

    // 4. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("school-docs")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[Upload storage]", uploadError);
      return NextResponse.json(
        { error: `Erreur upload : ${uploadError.message || "bucket inaccessible"}` },
        { status: 500 }
      );
    }

    // 5. Extract text and chunk
    let extraction;
    try {
      extraction = await extractAndChunk(buffer);
    } catch (err) {
      console.error("[Extract]", err);
      await supabase.storage.from("school-docs").remove([filePath]);
      const msg = err instanceof Error ? err.message : "erreur inconnue";
      return NextResponse.json(
        { error: `Impossible d'extraire le texte du PDF : ${msg}` },
        { status: 400 }
      );
    }

    if (extraction.chunks.length === 0) {
      await supabase.storage.from("school-docs").remove([filePath]);
      return NextResponse.json(
        { error: "Le PDF ne contient pas de texte extractible. Vérifiez qu'il ne s'agit pas d'un scan image." },
        { status: 400 }
      );
    }

    // 6. Insert document metadata
    const { data: doc, error: docError } = await supabase
      .from("school_documents")
      .insert({
        id: docId,
        user_id: user.id,
        title,
        doc_type: docType,
        file_path: filePath,
        file_size: file.size,
        page_count: extraction.pageCount,
        chunk_count: extraction.chunks.length,
      })
      .select()
      .single();

    if (docError) {
      console.error("[DB doc]", docError);
      await supabase.storage.from("school-docs").remove([filePath]);
      return NextResponse.json(
        { error: `Erreur base de données : ${docError.message}` },
        { status: 500 }
      );
    }

    // 7. Insert chunks
    const chunkRows = extraction.chunks.map((chunk) => ({
      school_doc_id: docId,
      user_id: user.id,
      chunk_index: chunk.chunk_index,
      chunk_title: chunk.chunk_title,
      content: chunk.content,
    }));

    const { error: chunksError } = await supabase
      .from("school_chunks")
      .insert(chunkRows);

    if (chunksError) {
      console.error("[DB chunks]", chunksError);
    }

    return NextResponse.json({
      id: doc.id,
      title: doc.title,
      doc_type: doc.doc_type,
      page_count: extraction.pageCount,
      chunk_count: extraction.chunks.length,
    });
  } catch (error) {
    console.error("[API /school-docs/upload]", error);
    const msg = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ error: `Erreur serveur : ${msg}` }, { status: 500 });
  }
}
