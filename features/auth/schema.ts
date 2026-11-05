import { z } from "zod";

export const EmailSchema = z.object({ email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")) });

/** Server action result (CLAUDE.md contract). `values` echoes non-secret input so the form keeps it. */
export type FormState = {
  ok?: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  values?: Record<string, string>;
} | null;
