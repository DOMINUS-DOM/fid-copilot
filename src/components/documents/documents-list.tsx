"use client";

import { useState, useMemo } from "react";
import { type Document, type DocumentCategory } from "@/types";
import { DocumentCard } from "./document-card";
import { DocumentsFilters } from "./documents-filters";

interface DocumentsListProps {
  documents: Document[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "all">("all");

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        search === "" ||
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        (doc.summary?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesCategory = category === "all" || doc.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, category]);

  return (
    <div className="flex flex-col gap-6">
      <DocumentsFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Aucun document ne correspond à vos critères.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        {filtered.length} document{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
        {filtered.length !== documents.length && ` sur ${documents.length}`}
      </p>
    </div>
  );
}
