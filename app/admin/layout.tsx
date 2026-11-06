import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="night" className="min-h-dvh">
      <main id="main" className="wrap py-16">
        {children}
      </main>
    </div>
  );
}
