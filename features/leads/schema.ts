import { z } from "zod";
import { industries } from "@/config/site";
import { needs } from "./options";

const optional = <T extends z.ZodType>(s: T) => z.preprocess((v) => (v === "" ? undefined : v), s.optional());

// Lead form (PRD §18.2). `need: "unsure"` is stored as null.
export const LeadSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  company: optional(z.string().trim().max(160)),
  industry: z.enum(industries, { error: "Choose an industry" }),
  need: z.enum(needs.map((n) => n.value) as [string, ...string[]], { error: "Choose what you need" }),
  repo_url: optional(z.url({ protocol: /^https?$/, error: "Enter a full link starting with https://" }).max(500)),
  message: z.string().trim().min(20, "Add a bit more detail: at least 20 characters").max(5000),
});
export type Lead = z.infer<typeof LeadSchema>;

export type LeadFormState = {
  ok?: boolean;
  /** Auto-declined (conflict industry): success copy must not promise a call. */
  declined?: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  values?: Record<string, string>;
} | null;
