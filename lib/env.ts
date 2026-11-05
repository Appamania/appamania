import "server-only";
import { z } from "zod";

// Server env validated on first use (PRD §21). Keys for later steps stay optional until their step lands.
const Env = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ADMIN_EMAIL: z.email().optional(),
  LEAD_SALT: z.string().min(8).optional(),
});

let cached: z.infer<typeof Env> | undefined;

export function env() {
  cached ??= Env.parse(process.env);
  return cached;
}
