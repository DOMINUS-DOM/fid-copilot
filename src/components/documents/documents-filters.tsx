"use client";

import { Input } from "@/components/ui/input";
import { type DocumentCategory, CATEGORY_LABELS } from "@/types";

interface DocumentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: DocumentCategory | "all";
  onCategoryChange: (value: DocumentCategory | "all") => void;
}

const categoryOptions: { value: DocumentCategory | "all"; label: string }[] = [
  { value: "all", label: "Toutes les catégories" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as DocumentCategory,
    label,
  })),
];

export function DocumentsFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: DocumentsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <Input
          placeholder="Rechercher un document..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as DocumentCategory | "all")}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
      >
        {categoryOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
