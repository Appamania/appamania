"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Misc";
import { createClient } from "@/lib/supabase/browser";

// Admin TOTP (PRD E3.3): enrol on first sign-in, then verify each session to reach aal2.
type Step =
  | { kind: "loading" }
  | { kind: "enrol"; factorId: string; qr: string; secret: string }
  | { kind: "verify"; factorId: string };

export function MfaSetup() {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ kind: "loading" });
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      const verified = data?.totp.find((f) => f.status === "verified");
      if (verified) return setStep({ kind: "verify", factorId: verified.id });
      // Drop abandoned enrolments so a fresh QR can be issued.
      for (const f of data?.all.filter((f) => f.status === "unverified") ?? [])
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      const { data: enrol, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator",
      });
      if (error || !enrol) return setError("Authenticator setup couldn't start. Try again.");
      setStep({ kind: "enrol", factorId: enrol.id, qr: enrol.totp.qr_code, secret: enrol.totp.secret });
    })();
  }, []);

  async function verify(form: FormData) {
    if (step.kind === "loading") return;
    setPending(true);
    const code = String(form.get("code") ?? "").replace(/\s/g, "");
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: step.factorId, code });
    setPending(false);
    if (error) return setError("That code didn't work. Enter the current 6-digit code from your app.");
    router.replace("/admin");
    router.refresh();
  }

  if (step.kind === "loading")
    return error ? (
      <div role="alert" className="grid gap-3 rounded-sm border border-danger p-3 text-small text-danger">
        {error}
        <Button variant="outline" size="sm" onClick={() => location.reload()}>
          Try again
        </Button>
      </div>
    ) : (
      <div role="status" aria-busy="true" className="grid gap-3">
        <span className="sr-only">Setting up your authenticator</span>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="size-44" />
      </div>
    );
  return (
    <form action={verify} className="grid gap-4" noValidate>
      {step.kind === "enrol" && (
        <div className="grid gap-3">
          <p className="text-small text-ink-muted">Scan with an authenticator app, then enter the 6-digit code.</p>
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from Supabase */}
          <img
            src={step.qr}
            alt="QR code for your authenticator app"
            width={176}
            height={176}
            className="rounded-sm bg-on-night p-2"
          />
          <p className="text-small">
            Can&apos;t scan? Enter this key: <code className="font-mono break-all">{step.secret}</code>
          </p>
        </div>
      )}
      <Input
        label="6-digit code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]{6,7}"
        required
        error={error}
        onChange={() => setError(undefined)}
      />
      <Button type="submit" loading={pending} className="w-full">
        Verify
      </Button>
    </form>
  );
}
