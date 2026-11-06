import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// 'unsafe-eval' only in dev: React Refresh needs it.
const csp = [
  "default-src 'self'",
  // ponytail: 'unsafe-inline' scripts; move to nonces if a third-party script is ever added.
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://script.google.com https://script.googleusercontent.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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
    ];
  },
  async redirects() {
    return [
      { source: "/studio", destination: "/apps", statusCode: 301 },
      { source: "/studio/:path*", destination: "/apps", statusCode: 301 },
      { source: "/oss/:path*", destination: "/open-source", statusCode: 301 },
      { source: "/services", destination: "/", statusCode: 301 },
      { source: "/services/:path*", destination: "/", statusCode: 301 },
      { source: "/legal/terms", destination: "/", statusCode: 301 },
      { source: "/legal/refunds", destination: "/", statusCode: 301 },
      { source: "/login", destination: "/", statusCode: 301 },
      { source: "/portal", destination: "/", statusCode: 301 },
      { source: "/portal/:path*", destination: "/", statusCode: 301 },
      { source: "/admin", destination: "/", statusCode: 301 },
      { source: "/admin/:path*", destination: "/", statusCode: 301 },
    ];
  },
};

export default createMDX()(nextConfig);
