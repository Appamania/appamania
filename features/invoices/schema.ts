import { z } from "zod";

export const CreateInvoiceSchema = z.object({
  clientId: z.uuid(),
  projectId: z.uuid().optional().or(z.literal("")),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(3).max(500),
  unitPriceRupees: z.coerce.number().positive().max(10_000_000),
});

export type InvoiceFormState =
  | { ok: true; id?: string; number?: string }
  | { fieldErrors: Record<string, string[] | undefined>; values?: Record<string, string> }
  | { formError: string; values?: Record<string, string> };
