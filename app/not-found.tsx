import Link from "next/link";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Code, Eyebrow } from "@/components/site/Blocks";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

// 404 (canvas board NotFound, PRD E1.10). Site chrome, Night theme.
export default function NotFound() {
  return (
    <div data-theme="night" className="min-h-dvh overflow-x-clip">
      <Navbar />
      <main id="main" className="wrap">
        <div className="relative grid items-center gap-10 pt-20 pb-14 min-[900px]:grid-cols-2 min-[900px]:pt-30">
          <div className="relative flex flex-col gap-6">
            <Eyebrow>Error 404</Eyebrow>
            <h1 className="text-display-xl">
              Route <span className="text-brand">not found.</span>
            </h1>
            <p className="max-w-[46ch] text-body-lg text-ink-muted">This page doesn&apos;t exist — or it moved during a migration. The rest of the site still works.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className={buttonStyles("primary")}>Back to home <Arrow /></Link>
              <Link href="/work" className={buttonStyles("outline")}>See the work</Link>
            </div>
          </div>
          <Code aria-hidden className="relative p-7 text-[15px]">
            <span className="text-danger">FlutterError</span>: Could not find a generator{"\n"}for route &quot;/old-page&quot; in _WidgetsAppState.{"\n\n"}
            <span>{"// suggested fix"}</span>{"\n"}
            <span className="k">Navigator</span>.pushNamed(context, <span className="s">&apos;/&apos;</span>);
          </Code>
        </div>
      </main>
      <Footer />
    </div>
  );
}
