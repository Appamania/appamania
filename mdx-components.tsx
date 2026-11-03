import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Prose styling for MDX content (case studies, studio pages): tokens only, 68ch measure (§13.4).
const components: MDXComponents = {
  h2: (p) => <h2 className="mt-12 mb-4 font-display text-step-2 font-semibold" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-3 font-display text-step-1 font-semibold" {...p} />,
  p: (p) => <p className="mb-5 text-fg-muted" {...p} />,
  ul: (p) => <ul className="mb-5 list-disc space-y-2 pl-5 text-fg-muted marker:text-primary" {...p} />,
  ol: (p) => <ol className="mb-5 list-decimal space-y-2 pl-5 text-fg-muted" {...p} />,
  strong: (p) => <strong className="font-medium text-fg" {...p} />,
  code: (p) => <code className="rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-step--1" {...p} />,
  a: ({ href = "", ...p }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-link underline underline-offset-4" {...p} />
    ) : (
      <a href={href} className="text-link underline underline-offset-4" {...p} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
