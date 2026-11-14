import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/Button";
import { Chip, Eyebrow } from "@/components/site/Blocks";
import { Mark } from "@/components/ui/Logo";
import { site } from "@/config/site";

/** Founder panel. Photo when set, otherwise the mark. Links that are empty are not shown. */
export function FounderCard({ compact }: { compact?: boolean }) {
  const links = [
    { href: site.links.linkedin, label: "LinkedIn" },
    { href: site.links.github, label: "GitHub" },
    { href: site.links.pubPublisher, label: "pub.dev" },
    { href: site.links.play, label: "Google Play" },
  ].filter((l) => l.href);
  const role = [site.founderRole, site.location].filter(Boolean).join(" · ");
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-line bg-paper-raised p-7 min-[900px]:flex-row min-[900px]:items-center">
      {site.founderPhoto ? (
        <Image
          src={site.founderPhoto}
          alt={[site.owner, site.founderRole.toLowerCase(), site.name].filter(Boolean).join(", ")}
          width={160}
          height={160}
          className="size-40 rounded-lg"
        />
      ) : (
        <span aria-hidden>
          <Mark className="size-20" />
        </span>
      )}
      <div className="flex flex-col gap-3">
        {site.owner && <h2 className="text-h2">{site.owner}</h2>}
        {role && <Eyebrow className="font-mono text-ink-muted">{role}</Eyebrow>}
        {!compact && links.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-brand">
                  <Chip>{l.label}</Chip>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {compact && (
          <Link href="/about" className="inline-flex min-h-11 items-center gap-2 text-ink hover:text-brand">
            Read about Appamania <Arrow />
          </Link>
        )}
      </div>
    </div>
  );
}
