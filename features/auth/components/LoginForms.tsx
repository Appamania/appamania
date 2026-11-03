"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { sendMagicLink, signInWithGoogle } from "../actions";

export function MagicLinkForm() {
  const [state, action] = useActionState(sendMagicLink, null);
  if (state?.ok)
    return (
      <p role="status" className="rounded-sm bg-brand-tint p-4 text-small">
        If that email has portal access, a sign-in link is on its way. It expires in one hour.
      </p>
    );
  return (
    <form action={action} className="grid gap-4" noValidate>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        spellCheck={false}
        autoCapitalize="none"
        required
        defaultValue={state?.values?.email}
        error={state?.fieldErrors?.email}
      />
      <SubmitButton className="w-full">Email me a sign-in link</SubmitButton>
    </form>
  );
}

export function GoogleButton() {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton variant="outline" className="w-full">
        Continue with Google
      </SubmitButton>
    </form>
  );
}
