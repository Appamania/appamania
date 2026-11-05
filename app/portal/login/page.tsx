import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { site } from "@/config/site";
import { GoogleButton, MagicLinkForm } from "@/features/auth/components/LoginForms";
import { getViewer, homeFor } from "@/lib/auth";

export const metadata: Metadata = { title: "Client login", robots: { index: false } };

const errors: Record<string, string> = {
  link: "That link has expired or was already used. Request a new one below.",
  google: "Google sign-in didn't finish. Try again or use an email link.",
  access: `This account doesn't have portal access. Email ${site.email} if that's wrong.`,
};

// Invite-only: no sign-up link anywhere (E3.1).
export default async function LoginPage({ searchParams }: PageProps<"/portal/login">) {
  const viewer = await getViewer();
  if (viewer) redirect(homeFor(viewer.role));
  const { error } = await searchParams;
  const message = typeof error === "string" ? errors[error] : undefined;
  return (
    <>
      <div className="grid gap-2">
        <h1 className="text-h2">Sign in to your portal</h1>
        <p className="text-small text-ink-muted">For invited clients. Projects, files and invoices in one place.</p>
      </div>
      {message && (
        <p role="alert" className="rounded-sm border border-danger p-3 text-small text-danger">
          {message}
        </p>
      )}
      <MagicLinkForm />
      <div className="eyebrow flex items-center gap-3 text-ink-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleButton />
    </>
  );
}
