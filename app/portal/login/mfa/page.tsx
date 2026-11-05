import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MfaSetup } from "@/features/auth/components/MfaSetup";
import { getViewer, LOGIN } from "@/lib/auth";

export const metadata: Metadata = { title: "Two-factor authentication", robots: { index: false } };

// Admin only (E3.3). Admin routes send aal1 sessions here.
export default async function MfaPage() {
  const viewer = await getViewer();
  if (viewer?.role !== "admin") redirect(LOGIN);
  if (viewer.aal === "aal2") redirect("/admin");
  return (
    <>
      <h1 className="text-h2">Two-factor authentication</h1>
      <MfaSetup />
    </>
  );
}
