import { Building2 } from "lucide-react";

interface SchoolHeaderProps {
  schoolName: string | null;
  schoolAddress: string | null;
  schoolPhone: string | null;
  schoolEmail: string | null;
  schoolLogoUrl: string | null;
}

export function SchoolHeader({
  schoolName,
  schoolAddress,
  schoolPhone,
  schoolEmail,
  schoolLogoUrl,
}: SchoolHeaderProps) {
  if (!schoolName) return null;

  return (
    <div className="mb-8 border-b-2 border-zinc-300 pb-5">
      <div className="flex items-start gap-4">
        {/* Logo or fallback icon */}
        {schoolLogoUrl ? (
          <img
            src={schoolLogoUrl}
            alt={schoolName}
            className="h-16 w-16 object-contain"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
            <Building2 className="h-6 w-6 text-zinc-400" />
          </div>
        )}

        {/* School info */}
        <div className="min-w-0 flex-1" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          <p className="text-base font-bold text-zinc-900" style={{ fontSize: "15px" }}>
            {schoolName}
          </p>
          {schoolAddress && (
            <p className="mt-0.5 whitespace-pre-line text-sm text-zinc-600" style={{ fontSize: "12px", lineHeight: "1.5" }}>
              {schoolAddress}
            </p>
          )}
          {(schoolPhone || schoolEmail) && (
            <p className="mt-1 text-sm text-zinc-500" style={{ fontSize: "11px" }}>
              {[schoolPhone, schoolEmail].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
