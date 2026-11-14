"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { budgets, offerIds, offers, type OfferId } from "@/config/offers";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";
import { fieldError, platforms, prepareNote, timelines, type NoteField, type NoteFields } from "@/lib/note";
import { createNote } from "@/lib/firestore";

function read(form: HTMLFormElement): NoteFields {
  const fd = new FormData(form);
  return {
    name: String(fd.get("name") ?? ""),
    email: String(fd.get("email") ?? ""),
    message: String(fd.get("message") ?? ""),
    link: String(fd.get("link") ?? ""),
    offer: String(fd.get("offer") ?? ""),
    platform: String(fd.get("platform") ?? ""),
    timeline: String(fd.get("timeline") ?? ""),
    budget: String(fd.get("budget") ?? ""),
    website: String(fd.get("website") ?? ""),
  };
}

// Creates a Firestore note when the Firebase keys are set. Otherwise opens a mailto.
export function NoteForm({ project, apiKey, offer }: { project: string; apiKey: string; offer?: OfferId }) {
  const [errors, setErrors] = useState<Partial<Record<NoteField, string>>>({});
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const statusRef = useRef<HTMLHeadingElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  useEffect(() => {
    if (formError) alertRef.current?.focus();
  }, [formError]);

  function onBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.currentTarget.name as NoteField;
    const message = e.currentTarget.form ? fieldError(read(e.currentTarget.form), field) : undefined;
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  if (sent)
    return (
      <div role="status" className="flex flex-col gap-3 rounded-lg border border-line bg-paper-raised p-6 sm:p-9">
        <span className="eyebrow text-brand">Note saved</span>
        <h2 ref={statusRef} tabIndex={-1} className="text-h1 outline-none">
          Thanks. Your note is in.
        </h2>
        <p className="text-ink-muted">Appamania replies within one working day.</p>
      </div>
    );

  return (
    <form
      noValidate
      aria-label="Send a note"
      onFocus={(e) => {
        if (started.current) return;
        started.current = true;
        track("form_start", { offer: read(e.currentTarget).offer });
      }}
      className="relative flex flex-col gap-5 rounded-lg border border-line bg-paper-raised p-6 sm:p-9"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        const prepared = prepareNote(read(e.currentTarget));
        if (!prepared.ok) {
          track("form_error", { field: prepared.field });
          setErrors({ [prepared.field]: prepared.error });
          (e.currentTarget.elements.namedItem(prepared.field) as HTMLElement | null)?.focus();
          return;
        }
        setErrors({});
        setFormError("");
        if (prepared.drop) {
          setSent(true);
          return;
        }
        track("form_submit", { offer: prepared.body.offer });
        if (!project || !apiKey) {
          const { body: b } = prepared;
          const body = [
            `From: ${b.name} <${b.email}>`,
            b.offer && `Offer: ${offers[b.offer as OfferId].name}`,
            "",
            b.message,
            b.link,
          ]
            .filter(Boolean)
            .join("\n");
          window.location.href = `mailto:${site.email}?${new URLSearchParams({ subject: "Note from the site", body })}`;
          return;
        }
        setPending(true);
        void createNote(project, apiKey, prepared.body)
          .then(() => {
            track("generate_lead", { offer: prepared.body.offer });
            setSent(true);
          })
          .catch(() => {
            track("form_fail");
            setPending(false);
            setFormError(`Could not save the note. Email ${site.email} instead.`);
          });
      }}
    >
      <span className="eyebrow text-brand">Start here</span>
      {formError && (
        <p
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-sm border border-danger p-3 text-small text-danger outline-none"
        >
          {formError}{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
        </p>
      )}
      <Select label="What do you need" name="offer" defaultValue={offer ?? ""} helper="Pick the closest fit.">
        <option value="">Just a question</option>
        {offerIds.map((id) => (
          <option key={id} value={id}>
            {offers[id].name}
          </option>
        ))}
      </Select>
      <Input label="Your name" name="name" autoComplete="name" required error={errors.name} onBlur={onBlur} />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        spellCheck={false}
        autoCapitalize="none"
        required
        error={errors.email}
        onBlur={onBlur}
      />
      <Textarea
        label="Message"
        name="message"
        required
        helper="What the app does, what is wrong, and when you need it."
        error={errors.message}
        onBlur={onBlur}
      />
      <Select label="Platform" name="platform" defaultValue="" optional>
        <option value="">Choose one</option>
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </Select>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Timeline" name="timeline" defaultValue="" optional>
          <option value="">Choose one</option>
          {timelines.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </Select>
        <Select label="Budget" name="budget" defaultValue="" optional className="tabular-nums">
          <option value="">Choose one</option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </Select>
      </div>
      <Input
        label="App or repo link"
        optional
        name="link"
        type="url"
        autoComplete="url"
        inputMode="url"
        spellCheck={false}
        autoCapitalize="none"
        placeholder="https://"
        error={errors.link}
        onBlur={onBlur}
      />
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Button type="submit" loading={pending} className="w-full">
        Send note
      </Button>
      <span className="font-mono text-small text-ink-muted">
        {project && apiKey ? `${site.owner} reads every note. Used only to reply.` : "Opens your email app."}
      </span>
    </form>
  );
}
