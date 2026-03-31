import { Building2 } from "lucide-react";

interface SchoolHeaderProps {
  schoolName: string | null;
  schoolAddress: string | null;
  schoolPhone: string | null;
  schoolEmail: string | null;
}

export function SchoolHeader({ schoolName, schoolAddress, schoolPhone, schoolEmail }: SchoolHeaderProps) {
  if (!schoolName) return null;

  return (
    <div className="mb-6 border-b border-zinc-200 pb-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="text-sm leading-relaxed">
          <p className="font-bold text-zinc-900">{schoolName}</p>
          {schoolAddress && <p className="whitespace-pre-line text-zinc-500">{schoolAddress}</p>}
          <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
            {schoolPhone && <span>{schoolPhone}</span>}
            {schoolEmail && <span>{schoolEmail}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
