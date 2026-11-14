import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { site } from "@/config/site";
import { cx } from "@/lib/cx";

/** Breadcrumb trail with BreadcrumbList JSON-LD. Pages pass the full trail, starting with Home. Separator is CSS. */
export function Breadcrumbs({ items }: { items: readonly { name: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="font-mono text-small text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className={cx(!last && "after:ml-2 after:content-['/']")}>
                {last ? (
                  <span aria-current="page" className="inline-flex min-h-11 items-center text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-ink">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: site.url + item.href,
          })),
        }}
      />
    </>
  );
}
