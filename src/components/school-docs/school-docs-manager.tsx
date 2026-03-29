"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type SchoolDocument,
  type SchoolDocType,
  SCHOOL_DOC_TYPE_LABELS,
} from "@/types";
import { Upload, FileText, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function SchoolDocsManager() {
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<SchoolDocType>("roi");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch("/api/school-docs");
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("doc_type", docType);

      const res = await fetch("/api/school-docs/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError(`Erreur serveur (${res.status}). Réessayez ou contactez le support.`);
        return;
      }

      if (!res.ok) {
        setError(data.error || `Erreur ${res.status} lors de l'upload`);
        return;
      }

      setSuccess(`"${data.title}" analysé : ${data.chunk_count} sections extraites de ${data.page_count} pages.`);
      setTitle("");
      setFile(null);
      setDocType("roi");

      // Reset file input
      const fileInput = document.getElementById("school-doc-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      fetchDocuments();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "erreur inconnue";
      setError(`Impossible de contacter le serveur : ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, docTitle: string) {
    if (!confirm(`Supprimer "${docTitle}" et toutes ses données ?`)) return;

    try {
      const res = await fetch(`/api/school-docs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        setSuccess(`"${docTitle}" supprimé.`);
      }
    } catch {
      setError("Erreur lors de la suppression");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Info banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Uploadez les documents de votre école pour contextualiser les réponses de l'assistant.
          Ces documents ne remplacent jamais les textes légaux officiels.
        </p>
      </div>

      {/* Upload form */}
      <Card>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Ajouter un document
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="school-doc-title" className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Titre du document
              </label>
              <input
                id="school-doc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : ROI 2024-2025"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="school-doc-type" className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Type de document
              </label>
              <select
                id="school-doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value as SchoolDocType)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                {Object.entries(SCHOOL_DOC_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="school-doc-file" className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Fichier PDF (max 10 MB)
            </label>
            <input
              id="school-doc-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />
          </div>

          <Button
            type="submit"
            disabled={uploading || !file || !title.trim()}
            className="self-start"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploader et analyser
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Document list */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
          Documents de votre école ({documents.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        ) : documents.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Aucun document. Uploadez votre premier document pour contextualiser l'assistant.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{doc.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {SCHOOL_DOC_TYPE_LABELS[doc.doc_type]}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {doc.chunk_count} sections &middot; {doc.page_count ?? "?"} pages
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.title)}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
