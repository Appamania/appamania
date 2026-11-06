import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";

// Footer with outlined giant wordmark (design brief). One light line: "fuelled by chai".
export function Footer() {
  const cols = [
    {
      title: "Work",
      links: [
        { href: "/work", label: "Case studies" },
        { href: "/apps", label: "Apps" },
        { href: "/open-source", label: "Open source" },
        { href: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: `mailto:${site.email}`, label: site.email },
        { href: "/contact", label: "Send a note" },
        { href: site.links.x, label: "X" },
        { href: site.links.github, label: "GitHub" },
        { href: site.links.linkedin, label: "LinkedIn" },
      ],
    },
  ];
  return (
    <footer className="wrap pt-24 pb-8">
      <div className="grid grid-cols-2 gap-8 text-[15px] min-[900px]:grid-cols-[2fr_1fr_1fr]">
        <div className="col-span-2 min-[900px]:col-span-1">
          <Logo />
          <p className="mt-4 max-w-[30ch] text-ink-muted">{site.tagline} Built in Kolkata, fuelled by chai.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="eyebrow mb-3.5 text-ink-muted">{c.title}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-1 text-ink-muted break-all hover:text-brand pointer-coarse:py-2.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p
        aria-hidden
        className="mt-20 mb-6 text-[clamp(80px,19vw,300px)] leading-[0.8] font-semibold tracking-[-0.07em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
      >
        appamania
      </p>
      <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-5 font-mono text-[13px] text-ink-muted">
        <span>© {new Date().getFullYear()} Appamania</span>
        <span>
          <Link href="/legal/privacy" className="hover:text-ink">Privacy</Link>
        </span>
        <span>Kolkata</span>
      </div>
    </footer>
  );
}
