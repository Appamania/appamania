import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

// Shared sign-in (canvas board PortalLogin). Night like the site: it is the door from the site.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="grid w-full max-w-sm justify-items-center gap-8">
        <Link href="/" aria-label="Appamania home">
          <Logo />
        </Link>
        <Card className="grid w-full gap-6">{children}</Card>
      </div>
    </main>
  );
}
