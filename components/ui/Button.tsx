import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Pill buttons (PRD §8, Chai Studio). One primary per view. Only transform animates.
export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-paper-raised",
  ghost: "text-brand hover:bg-brand-tint",
  danger: "border border-danger text-danger hover:bg-paper-sunken",
  /** On a brand-filled band (CTA). */
  inverse: "bg-on-brand text-brand hover:-translate-y-px",
};
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-small",
  md: "h-11 px-5 text-body",
  lg: "h-13 px-6 text-body",
};

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cx(
    "group/btn inline-flex shrink-0 items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap select-none",
    "transition-[transform,background-color,border-color] duration-(--dur) ease-out active:translate-y-px",
    "aria-busy:pointer-events-none aria-disabled:opacity-50 disabled:opacity-50 [&_svg]:size-5",
    size === "sm" && "[&_svg]:size-4",
    "pointer-coarse:min-h-11",
    sizes[size],
    variants[variant],
    className,
  );
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; loading?: boolean };

export function Button({
  variant,
  size,
  icon,
  loading,
  className,
  children,
  type = "button",
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button type={type} aria-busy={loading || undefined} className={buttonStyles(variant, size, className)} {...rest}>
      {loading ? <LoaderCircle aria-hidden className="animate-spin motion-reduce:animate-none" /> : icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonStyles(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}

/** Arrow that nudges on button hover (design brief: the only hover motion besides card lift). */
export function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="transition-transform duration-(--dur) group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
    />
  );
}
