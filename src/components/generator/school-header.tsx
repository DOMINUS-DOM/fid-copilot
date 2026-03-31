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
    <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1.5px solid #a1a1aa" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {/* Logo — preserve aspect ratio, max height 50px */}
        {schoolLogoUrl ? (
          <img
            src={schoolLogoUrl}
            alt={schoolName}
            crossOrigin="anonymous"
            style={{
              height: "50px",
              width: "auto",
              maxWidth: "120px",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            backgroundColor: "#f4f4f5",
            flexShrink: 0,
          }}>
            <Building2 style={{ width: "20px", height: "20px", color: "#a1a1aa" }} />
          </div>
        )}

        {/* School info */}
        <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#18181b" }}>
            {schoolName}
          </p>
          {schoolAddress && (
            <p style={{ margin: "2px 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#52525b", whiteSpace: "pre-line" }}>
              {schoolAddress}
            </p>
          )}
          {(schoolPhone || schoolEmail) && (
            <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#71717a" }}>
              {[schoolPhone, schoolEmail].filter(Boolean).join(" — ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
