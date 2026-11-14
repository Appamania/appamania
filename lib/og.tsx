import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { nightBrand as brand, nightInkMuted, themeColor } from "@/styles/theme-color";
import { emailColors } from "@/styles/email";

// Open Graph images: 1200×630, Night theme (PRD E1.11). Every opengraph-image route calls this.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        background: themeColor.night,
        color: emailColors.paper,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 12, background: brand }} />
        appamania
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 600, color: brand }}>{eyebrow}</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: -3.5,
            lineHeight: 0.98,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ fontSize: 28, color: nightInkMuted }}>{`${site.descriptor} · ${site.location}`}</div>
    </div>,
    ogSize,
  );
}
