import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// 'unsafe-eval' only in dev: React Refresh needs it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebaseremoteconfig.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com",
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
    ];
  },
};

export default nextConfig;
