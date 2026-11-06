"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { getDoc, saveDoc } from "@/lib/firestore";
import { SettingsSchema, type Settings } from "@/lib/schemas";

/** settings/site: notice banner and availability line. Shown on every page within 60s. */
export function SiteSettings({ token, project, apiKey }: { token: string; project: string; apiKey: string }) {
  const [draft, setDraft] = useState<Settings | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    getDoc(project, apiKey, "settings/site", token)
      .then((fields) => {
        if (ignore) return;
        const parsed = SettingsSchema.safeParse(fields ?? {});
        setDraft(parsed.success ? parsed.data : { notice: "", availability: "" });
      })
      .catch(() => {
        if (!ignore) setError("Could not load settings. Reload the page.");
      });
    return () => {
      ignore = true;
    };
  }, [apiKey, project, token]);

  if (!draft)
    return (
      <p role={error ? "alert" : undefined} className={error ? "text-small text-danger" : "text-ink-muted"}>
        {error || "Loading."}
      </p>
    );
  return (
    <form
      noValidate
      className="flex max-w-xl flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = SettingsSchema.safeParse(draft);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Check the fields.");
          return;
        }
        setPending(true);
        setError("");
        setSaved(false);
        saveDoc(project, apiKey, token, "settings", "site", parsed.data)
          .then(() => setSaved(true))
          .catch(() => setError("Could not save. Try again."))
          .finally(() => setPending(false));
      }}
    >
      {error && (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-small text-ink-muted">
          Saved. Live within a minute.
        </p>
      )}
      <Input
        label="Notice"
        name="notice"
        helper="Banner above the nav. Empty hides it."
        value={draft.notice}
        onChange={(e) => setDraft({ ...draft, notice: e.target.value })}
      />
      <Input
        label="Availability"
        name="availability"
        helper="Footer line, e.g. Taking one sprint from January. Empty hides it."
        value={draft.availability}
        onChange={(e) => setDraft({ ...draft, availability: e.target.value })}
      />
      <Button type="submit" loading={pending} className="self-start">
        Save
      </Button>
    </form>
  );
}
