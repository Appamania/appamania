import "server-only";
import type { Json } from "@/lib/supabase/types";
import { createAdminClient } from "@/lib/supabase/admin";

/** Append-only audit trail (PRD E5.5). Service role: audit_log has no update/delete for anyone. */
export async function audit(actor: string, action: string, entity: string, entityId?: string, diff?: Json) {
  const { error } = await createAdminClient()
    .from("audit_log")
    .insert({ actor, action, entity, entity_id: entityId, diff });
  if (error) throw error;
}
