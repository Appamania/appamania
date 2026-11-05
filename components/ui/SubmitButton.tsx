"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonVariant } from "./Button";

/** Form submit with pending state from the enclosing <form> (PRD §8). */
export function SubmitButton({
  children,
  variant = "primary",
  className,
  blocked,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  /** Announced as unavailable; the form's onSubmit explains why. */
  blocked?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      loading={pending}
      aria-disabled={blocked || undefined}
      // Cancelling the click also cancels Enter-key implicit submission while pending.
      onClick={(e) => pending && e.preventDefault()}
      className={className}
    >
      {children}
    </Button>
  );
}
