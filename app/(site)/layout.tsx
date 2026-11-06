import { Analytics } from "@/components/site/Analytics";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { Remote } from "@/components/site/Remote";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="night" className="min-h-dvh overflow-x-clip">
      <Remote>
        <Navbar />
        <main id="main" className="wrap">
          {children}
        </main>
        <Footer />
      </Remote>
      <Analytics />
    </div>
  );
}
