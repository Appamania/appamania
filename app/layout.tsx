import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/config/site";
import { themeColor } from "@/styles/theme-color";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Flutter apps that ship`, template: `%s · ${site.name}` },
  description: site.tagline,
};

export const viewport: Viewport = { themeColor: themeColor.night };

// Site pages are Night.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" data-theme="night" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <a
          href="#main"
          className="sr-only z-(--z-toast) rounded-pill bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
