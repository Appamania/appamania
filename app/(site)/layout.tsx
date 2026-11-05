import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

// Public site: Night theme (set on <html>), floating nav, footer. Pages are static.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="night" className="min-h-dvh overflow-x-clip">
      <Navbar />
      <main id="main" className="wrap">
        {children}
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
