import { Analytics } from "@/components/site/Analytics";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div data-theme="night" className="min-h-dvh overflow-x-clip">
      {settings.notice && (
        <div role="status" className="wrap pt-4">
          <p className="rounded-lg border border-line bg-paper-raised px-4 py-3 text-small text-ink">
            {settings.notice}
          </p>
        </div>
      )}
      <Navbar />
      <main id="main" className="wrap">
        {children}
      </main>
      <Footer availability={settings.availability} />
      <Analytics />
    </div>
  );
}
