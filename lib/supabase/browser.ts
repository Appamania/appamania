import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/** Browser client (anon key + user session). Only for interactive leaves, e.g. MFA enrolment. */
export function createClient() {
  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
