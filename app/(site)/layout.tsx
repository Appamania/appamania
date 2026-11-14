import { Analytics } from "@/components/site/Analytics";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { site } from "@/config/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="night" className="min-h-dvh overflow-x-clip">
      {site.notice && (
        <div role="status" className="wrap pt-4">
          <p className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-small text-ink">
            {site.notice}
          </p>
        </div>
      )}
      <Navbar />
      <main id="main" className="wrap">
        {children}
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}
