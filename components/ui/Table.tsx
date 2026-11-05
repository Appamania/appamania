import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

/** Compact admin/portal table (design brief: table-first). Stacks as labeled rows below md. */
export function Table({ className, children, ...rest }: ComponentProps<"table">) {
  return (
    <div className="rounded-lg border border-line max-md:border-0">
      <table
        className={cx(
          "w-full text-left text-small",
          "max-md:block",
          "md:min-w-[640px]",
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-line bg-paper-sunken font-mono text-ink-muted max-md:sr-only">
      {children}
    </thead>
  );
}

export function Th({ className, scope = "col", ...rest }: ComponentProps<"th">) {
  return <th scope={scope} className={cx("px-4 py-3 font-medium", className)} {...rest} />;
}

export function Td({
  className,
  label,
  children,
  ...rest
}: ComponentProps<"td"> & { label?: string }) {
  return (
    <td
      data-label={label}
      className={cx(
        "px-4 py-3",
        label &&
          "max-md:flex max-md:items-center max-md:justify-between max-md:gap-3 max-md:border-b max-md:border-line max-md:px-4 max-md:py-2.5 max-md:before:shrink-0 max-md:before:font-mono max-md:before:text-small max-md:before:text-ink-muted max-md:before:content-[attr(data-label)]",
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

export function Tr({ className, ...rest }: ComponentProps<"tr">) {
  return (
    <tr
      className={cx(
        "border-b border-line last:border-0",
        "max-md:mb-3 max-md:block max-md:rounded-lg max-md:border max-md:border-line max-md:last:border",
        className,
      )}
      {...rest}
    />
  );
}
