import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { nightBrand as brand, themeColor } from "@/styles/theme-color";
import { emailColors } from "@/styles/email";

// One static OG image (1200×630, PRD E1.11), Night theme.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 80, background: themeColor.night, color: emailColors.paper }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: brand }} />
        appamania
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", fontSize: 88, fontWeight: 600, letterSpacing: -4, lineHeight: 0.95, maxWidth: 1000 }}>
        Flutter apps that actually&nbsp;<span style={{ color: brand }}>ship.</span>
      </div>
      <div style={{ fontSize: 28, color: emailColors.line }}>Rescue · migration · launch — fixed price, you own the code</div>
    </div>,
    size,
  );
}
