"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type UserPreferences } from "@/types";
import {
  User,
  MessageSquare,
  FileText,
  Building2,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import Link from "next/link";

// ============================================================
// Option selector helper
// ============================================================

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
              value === o.value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls = "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white";
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
      {multiline ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

// ============================================================
// Main component
// ============================================================

export function SettingsWorkspace() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // School docs status
  const [schoolDocsCount, setSchoolDocsCount] = useState(0);

  useEffect(() => {
    fetchPrefs();
    fetchSchoolDocs();
  }, []);

  async function fetchPrefs() {
    try {
      const res = await fetch("/api/preferences");
      const data = await res.json();
      if (res.ok && data.preferences) {
        setPrefs(data.preferences);
        // Apply saved theme
        if (data.preferences.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function fetchSchoolDocs() {
    try {
      const res = await fetch("/api/school-docs");
      const data = await res.json();
      if (res.ok) setSchoolDocsCount(data.documents?.length ?? 0);
    } catch { /* silent */ }
  }

  async function handleSave() {
    if (!prefs) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setSaving(false);
    }
  }

  function update(field: keyof UserPreferences, value: string) {
    if (!prefs) return;
    setPrefs({ ...prefs, [field]: value });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!prefs) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* ============================================================ */}
      {/* Section: Profil */}
      {/* ============================================================ */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Profil</h2>
        </div>
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Prénom" value={prefs.first_name ?? ""} onChange={(v) => update("first_name", v)} placeholder="Ex : Marie" />
            <TextField label="Nom" value={prefs.last_name ?? ""} onChange={(v) => update("last_name", v)} placeholder="Ex : Dupont" />
            <TextField label="Fonction" value={prefs.job_title ?? ""} onChange={(v) => update("job_title", v)} placeholder="Ex : Directrice" />
            <TextField label="Établissement" value={prefs.school_name ?? ""} onChange={(v) => update("school_name", v)} placeholder="Ex : Athénée Royal de Liège" />
            <TextField label="Réseau" value={prefs.school_network ?? ""} onChange={(v) => update("school_network", v)} placeholder="Ex : WBE, Libre, Provincial..." />
            <TextField label="Niveau" value={prefs.school_level ?? ""} onChange={(v) => update("school_level", v)} placeholder="Ex : Secondaire ordinaire" />
          </div>
        </Card>
      </section>

      {/* ============================================================ */}
      {/* Section: Préférences IA */}
      {/* ============================================================ */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Préférences de réponse</h2>
        </div>
        <Card>
          <div className="flex flex-col gap-5">
            <OptionGroup
              label="Ton par défaut"
              value={prefs.default_tone}
              onChange={(v) => update("default_tone", v)}
              options={[
                { value: "neutre", label: "Neutre" },
                { value: "ferme", label: "Ferme" },
                { value: "apaisant", label: "Apaisant" },
                { value: "formel", label: "Formel" },
              ]}
            />
            <OptionGroup
              label="Mode préféré"
              value={prefs.default_mode}
              onChange={(v) => update("default_mode", v)}
              options={[
                { value: "examen", label: "Examen" },
                { value: "terrain", label: "Terrain" },
                { value: "portfolio", label: "Portfolio" },
              ]}
            />
            <OptionGroup
              label="Longueur souhaitée"
              value={prefs.default_length}
              onChange={(v) => update("default_length", v)}
              options={[
                { value: "courte", label: "Courte" },
                { value: "standard", label: "Standard" },
                { value: "detaillee", label: "Détaillée" },
              ]}
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Ces préférences seront utilisées comme valeurs par défaut dans l{"'"}Assistant et le Générateur.
            </p>
          </div>
        </Card>
      </section>

      {/* ============================================================ */}
      {/* Section: Génération */}
      {/* ============================================================ */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Génération de documents</h2>
        </div>
        <Card>
          <div className="flex flex-col gap-4">
            <TextField
              label="Signature par défaut"
              value={prefs.signature ?? ""}
              onChange={(v) => update("signature", v)}
              placeholder="Ex : Marie Dupont, Directrice"
              multiline
            />
            <TextField
              label="Formule de politesse"
              value={prefs.closing_formula ?? ""}
              onChange={(v) => update("closing_formula", v)}
              placeholder="Ex : Veuillez agréer l'expression de mes salutations distinguées."
              multiline
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Ces informations seront intégrées automatiquement dans les courriers générés.
            </p>
          </div>
        </Card>
      </section>

      {/* ============================================================ */}
      {/* Section: Mon école */}
      {/* ============================================================ */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Documents de votre école</h2>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {schoolDocsCount > 0 ? (
                  <><span className="font-semibold">{schoolDocsCount}</span> document{schoolDocsCount > 1 ? "s" : ""} uploadé{schoolDocsCount > 1 ? "s" : ""}</>
                ) : (
                  "Aucun document uploadé"
                )}
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                Vos documents enrichissent les réponses de l{"'"}assistant avec le contexte de votre école.
              </p>
            </div>
            <Link
              href="/mon-ecole"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            >
              <Upload className="h-3.5 w-3.5" />
              Gérer
            </Link>
          </div>
          {schoolDocsCount === 0 && (
            <div className="mt-3 rounded-lg bg-amber-50/50 px-3 py-2 dark:bg-amber-900/10">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Uploadez votre ROI et votre règlement des études pour des réponses plus contextualisées.
              </p>
            </div>
          )}
        </Card>
      </section>

      {/* ============================================================ */}
      {/* Section: Apparence */}
      {/* ============================================================ */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Apparence</h2>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mode d{"'"}affichage</p>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">Choisissez entre le mode clair et le mode sombre.</p>
            </div>
            <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => {
                  update("theme", "light");
                  document.documentElement.classList.remove("dark");
                }}
                className={`rounded-l-xl px-4 py-2 text-xs font-medium transition-all ${
                  (prefs.theme ?? "light") === "light"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                Clair
              </button>
              <button
                type="button"
                onClick={() => {
                  update("theme", "dark");
                  document.documentElement.classList.add("dark");
                }}
                className={`rounded-r-xl px-4 py-2 text-xs font-medium transition-all ${
                  prefs.theme === "dark"
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                Sombre
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* ============================================================ */}
      {/* Save bar */}
      {/* ============================================================ */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Enregistrement...</>
          ) : (
            <><Save className="mr-1.5 h-4 w-4" />Enregistrer les préférences</>
          )}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" /> Enregistré
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </span>
        )}
      </div>
    </div>
  );
}
