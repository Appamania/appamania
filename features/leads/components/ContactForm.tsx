"use client";

import Script from "next/script";
import { useActionState, useEffect } from "react";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { industries } from "@/config/site";
import { createLead } from "../actions";
import { needs } from "../options";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

// Lead form (canvas board Contact, PRD E2.1). Turnstile is the only third-party script, on this page only.
export function ContactForm({ siteKey, needLabels }: { siteKey: string; needLabels: Record<string, string> }) {
  const [state, action] = useActionState(createLead, null);
  const v = state?.values ?? {};
  const e = state?.fieldErrors ?? {};

  // A Turnstile token is single-use: issue a fresh one after any failed attempt.
  useEffect(() => {
    if (state && !state.ok) window.turnstile?.reset();
  }, [state]);

  if (state?.ok)
    return (
      <div role="status" className="flex flex-col gap-3 rounded-lg border border-line bg-paper-raised p-9">
        <span className="eyebrow text-brand">Message sent</span>
        <h2 className="text-h1">Thanks — it&apos;s in.</h2>
        <p className="text-ink-muted">
          {state.declined
            ? "A confirmation is on its way to your inbox."
            : "A confirmation is on its way to your inbox. I reply within one working day."}
        </p>
      </div>
    );

  return (
    <form action={action} noValidate aria-label="Project enquiry" className="relative flex flex-col gap-5 rounded-lg border border-line bg-paper-raised p-6 sm:p-9">
      <span className="eyebrow text-brand">Project enquiry</span>
      {state?.formError && (
        <p role="alert" className="rounded-sm border border-danger p-3 text-small text-danger">
          {state.formError}
        </p>
      )}
      <Input label="Your name" name="name" autoComplete="name" required defaultValue={v.name} error={e.name} />
      <Input label="Work email" name="email" type="email" autoComplete="email" spellCheck={false} autoCapitalize="none" required defaultValue={v.email} error={e.email} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Company" name="company" autoComplete="organization" defaultValue={v.company} error={e.company} />
        <Select label="Industry" name="industry" required defaultValue={v.industry ?? ""} error={e.industry}>
          <option value="" disabled>
            Choose one
          </option>
          {industries.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </Select>
      </div>
      <Textarea
        label="What does the app do, and what's wrong?"
        name="message"
        required
        placeholder="Food delivery app. Crashes on checkout since the last iOS update."
        defaultValue={v.message}
        error={e.message}
      />
      <Input
        label="Repo or store link"
        name="repo_url"
        type="url"
        inputMode="url"
        spellCheck={false}
        autoCapitalize="none"
        placeholder="https://play.google.com/store/apps/details?id=…"
        defaultValue={v.repo_url}
        error={e.repo_url}
      />
      <fieldset aria-describedby={e.need ? "need-msg" : undefined} className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-small font-medium">
          What do you need? <span className="font-normal text-ink-muted">(required)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {needs.map((n) => (
            <label
              key={n.value}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-pill border border-line-strong px-3.5 text-small text-ink-muted has-checked:border-brand has-checked:text-brand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus pointer-coarse:h-11"
            >
              <input type="radio" name="need" value={n.value} defaultChecked={(v.need ?? "audit") === n.value} className="size-4 accent-(--brand)" />
              {needLabels[n.value] ?? n.label}
            </label>
          ))}
        </div>
        {e.need && (
          <p id="need-msg" className="text-small text-danger">
            {e.need[0]}
          </p>
        )}
      </fieldset>
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" data-size="flexible" />
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <SubmitButton className="w-full">Send enquiry</SubmitButton>
      <span className="font-mono text-[12px] text-ink-muted">No newsletters. Your details are used only to reply.</span>
    </form>
  );
}
