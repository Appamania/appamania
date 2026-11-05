import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// PRD §22. `'unsafe-eval'` only in dev: React Refresh needs it.
const csp = [
  "default-src 'self'",
  // ponytail: 'unsafe-inline' scripts; move to nonces if a third-party script is ever added.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self'",
  ["connect-src 'self'", process.env.NEXT_PUBLIC_SUPABASE_URL, "https://*.ingest.sentry.io", "https://vitals.vercel-insights.com"]
    .filter(Boolean)
    .join(" "),
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://rzp.io https://*.razorpay.com",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:area(portal|admin)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  // E1.8: old URLs keep working (301, not Next's default 308).
  async redirects() {
    return [
      { source: "/studio", destination: "/apps", statusCode: 301 },
      { source: "/studio/:path*", destination: "/apps", statusCode: 301 },
      { source: "/oss/:path*", destination: "/open-source", statusCode: 301 },
      {
        source: "/login",
        destination: process.env.NEXT_PUBLIC_PORTAL_ENABLED === "true" ? "/portal/login" : "/",
        statusCode: 301,
      },
    ];
  },
};

// MDX content (PRD §9) imported by pages from content/; no plugins, so Turbopack-compatible.
export default createMDX()(nextConfig);
