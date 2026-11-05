// <meta name="theme-color"> needs literal colors; kept in styles/ so check:tokens stays strict elsewhere.
// Mirrors --paper per theme (PRD §7).
export const themeColor = { night: "#070B09", dark: "#0F1512", light: "#F6F2EA" } as const;

/** Night --brand, for ImageResponse (OG image), which cannot read CSS variables. */
export const nightBrand = "#3DDC84";
