import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { site } from "@/config/site";

// The only file that knows the email provider (PRD §17). Errors are logged, never thrown:
// email must never block a lead or a payment. Without RESEND_API_KEY (local, CI) it logs instead.
export async function send(to: string | string[], subject: string, react: ReactElement, idempotencyKey?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email:dev] to=${[to].flat().join(",")} subject="${subject}"`);
    return;
  }
  const { error } = await new Resend(key).emails.send(
    { from: site.emailFrom, to, subject, react, replyTo: site.email },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
  if (error) console.error("email failed", subject, error.message);
}
