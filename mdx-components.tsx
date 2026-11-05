import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Prose for MDX content (case studies): tokens only, 58ch measure.
const components: MDXComponents = {
  h2: (p) => <h2 className="mt-12 mb-4 text-h1" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-3 text-h2" {...p} />,
  p: (p) => <p className="max-w-[58ch] text-[19px] leading-[1.6] text-ink-muted first:text-ink" {...p} />,
  ul: (p) => <ul className="list-disc space-y-2 pl-5 text-ink-muted marker:text-brand" {...p} />,
  strong: (p) => <strong className="font-medium text-ink" {...p} />,
  code: (p) => <code className="rounded-sm bg-paper-sunken px-1.5 py-0.5 font-mono text-code" {...p} />,
  a: ({ href = "", ...p }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-brand underline underline-offset-4" {...p} />
    ) : (
      <a href={href} className="text-brand underline underline-offset-4" {...p} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
