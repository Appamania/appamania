import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";

// Footer with outlined giant wordmark (design brief). One light line: "fuelled by chai".
export function Footer() {
  const cols = [
    {
      title: "Studio",
      links: [
        { href: "/services", label: "Services and prices" },
        { href: "/services/flutter-upgrade", label: "Flutter upgrade" },
        { href: "/services/flutter-app-rescue", label: "Flutter app rescue" },
        { href: "/services/flutter-app-audit", label: "Flutter app audit" },
        { href: "/work", label: "Work" },
        { href: "/apps", label: "Apps" },
        { href: "/open-source", label: "Open source" },
        { href: "/about", label: "About" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: `mailto:${site.email}`, label: site.email },
        { href: "/contact?offer=audit", label: "Book an audit" },
        { href: site.links.booking, label: "Book a call" },
        { href: site.links.linkedinCompany, label: "LinkedIn, Appamania" },
        { href: site.links.github, label: "GitHub" },
        { href: site.links.x, label: "X" },
        { href: site.links.linkedin, label: `LinkedIn, ${site.owner}` },
      ].filter((l) => l.href),
    },
  ];
  return (
    <footer className="wrap pt-24 pb-8">
      <div className="grid grid-cols-2 gap-8 text-body min-[900px]:grid-cols-[2fr_1fr_1fr]">
        <div className="col-span-2 min-[900px]:col-span-1">
          <Logo />
          <p className="mt-4 max-w-[30ch] text-ink-muted">
            {site.descriptor}. {site.tagline} Built in Kolkata, fuelled by chai.
          </p>
          {site.availability && (
            <p className="mt-4 flex items-center gap-2.5 font-mono text-small text-ink">
              <span aria-hidden className="size-2 rounded-full bg-brand" />
              {site.availability}
            </p>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="mb-3.5 eyebrow text-ink-muted">{c.title}</h2>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    data-cta={l.href === site.links.booking ? "booking" : undefined}
                    className="block py-1 break-words text-ink-muted hover:text-brand pointer-coarse:py-2.5"
                  >
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
      <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-5 font-mono text-small text-ink-muted">
        <span>
          © {new Date().getFullYear()} {site.legalName || site.identity}
        </span>
        <span>
          <Link href="/legal/privacy" className="inline-flex min-h-11 items-center hover:text-ink">
            Privacy
          </Link>
        </span>
        <span>{site.billing}</span>
      </div>
    </footer>
  );
}
