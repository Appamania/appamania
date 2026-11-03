import { z } from "zod";
import { industries } from "@/config/site";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const OnboardSchema = z.object({
  company: z.string().trim().min(2, "Enter the company or person name").max(120),
  name: z.string().trim().min(2, "Enter the contact's name").max(120),
  email,
  phone: z.string().trim().regex(/^\+?[0-9 ]{8,16}$/, "Enter a phone number with country code").optional().or(z.literal("")),
  industry: z.enum(industries, "Choose an industry"),
});

export const InviteSchema = z.object({ clientId: z.uuid(), name: z.string().trim().min(2).max(120), email });

export const ClientIdSchema = z.object({
  clientId: z.uuid(),
  /** Typed-name confirmation for offboarding (E3.5). */
  confirm: z.string().trim().optional(),
});
