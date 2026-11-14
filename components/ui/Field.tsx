import { ChevronDown, CircleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// PRD §8 + design brief: label above, helper below, error replaces helper (icon + danger text), aria wiring.
type FieldProps = {
  label: string;
  helper?: ReactNode;
  /** zod fieldErrors entry or a single message */
  error?: string | string[];
  required?: boolean;
  /** Adds a muted " (optional)" after the label text. */
  optional?: boolean;
};

function wiring(id: string, { helper, error }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  return {
    message,
    msgId: `${id}-msg`,
    aria: {
      "aria-invalid": message ? true : undefined,
      "aria-describedby": message || helper ? `${id}-msg` : undefined,
    },
  };
}

export function Field({
  id,
  label,
  required,
  optional,
  helper,
  message,
  children,
}: { id: string; message?: string; children: ReactNode } & Omit<FieldProps, "error">) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-small font-medium">
        {label}
        {required && <span className="font-normal text-ink-muted"> (required)</span>}
        {optional && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      {children}
      {message ? (
        <p id={`${id}-msg`} className="flex items-start gap-1.5 text-small text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {message}
        </p>
      ) : (
        helper && (
          <p id={`${id}-msg`} className="text-small text-ink-muted">
            {helper}
          </p>
        )
      )}
    </div>
  );
}

// 16px on phones avoids iOS zoom.
export const controlStyles =
  "w-full rounded-sm border border-line-strong bg-paper-raised px-3.5 text-body text-ink placeholder:text-ink-muted focus-visible:border-brand aria-invalid:border-danger max-sm:text-body";

export function Input({
  label,
  helper,
  error,
  required,
  optional,
  className,
  ...rest
}: FieldProps & ComponentProps<"input"> & { name: string }) {
  const id = rest.id ?? rest.name;
  const { message, aria } = wiring(id, { label, helper, error });
  return (
    <Field id={id} label={label} required={required} optional={optional} helper={helper} message={message}>
      <input id={id} required={required} className={cx(controlStyles, "h-11", className)} {...aria} {...rest} />
    </Field>
  );
}

export function Textarea({
  label,
  helper,
  error,
  required,
  optional,
  className,
  ...rest
}: FieldProps & ComponentProps<"textarea"> & { name: string }) {
  const id = rest.id ?? rest.name;
  const { message, aria } = wiring(id, { label, helper, error });
  return (
    <Field id={id} label={label} required={required} optional={optional} helper={helper} message={message}>
      <textarea
        id={id}
        required={required}
        rows={5}
        className={cx(controlStyles, "min-h-24 py-2", className)}
        {...aria}
        {...rest}
      />
    </Field>
  );
}

export function Select({
  label,
  helper,
  error,
  required,
  optional,
  className,
  children,
  ...rest
}: FieldProps & ComponentProps<"select"> & { name: string }) {
  const id = rest.id ?? rest.name;
  const { message, aria } = wiring(id, { label, helper, error });
  return (
    <Field id={id} label={label} required={required} optional={optional} helper={helper} message={message}>
      <div className="relative">
        <select
          id={id}
          required={required}
          className={cx(controlStyles, "h-11 appearance-none pr-9", className)}
          {...aria}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </Field>
  );
}

/** Native checkbox/radio styled with accent-color . */
export function Choice({
  label,
  type = "checkbox",
  className,
  ...rest
}: { label: ReactNode; type?: "checkbox" | "radio" } & Omit<ComponentProps<"input">, "type">) {
  return (
    <label
      className={cx(
        "inline-flex min-h-6 cursor-pointer items-center gap-2 text-small pointer-coarse:min-h-11",
        className,
      )}
    >
      <input type={type} className="size-4 accent-(--brand)" {...rest} />
      {label}
    </label>
  );
}

/** Switch = checkbox with role="switch" . The thumb moves with transform only. */
export function Switch({ label, className, ...rest }: { label: ReactNode } & Omit<ComponentProps<"input">, "type">) {
  return (
    <label
      className={cx(
        "inline-flex min-h-6 cursor-pointer items-center gap-2 text-small pointer-coarse:min-h-11",
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className={cx(
          "relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full border border-line-strong bg-paper-sunken checked:border-brand checked:bg-brand",
          "before:absolute before:top-px before:left-px before:size-4 before:rounded-full before:bg-ink-muted checked:before:bg-on-brand",
          "before:transition-transform before:duration-(--dur) checked:before:translate-x-4",
        )}
        {...rest}
      />
      {label}
    </label>
  );
}
