"use client";

import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { isOfferId, offers } from "@/config/offers";
import { deleteDoc, getDoc, listDocs, readToken, saveDoc } from "@/lib/firestore";
import {
  ADMIN_EMAIL,
  AppSchema,
  isAdmin,
  NoteSchema,
  PackageSchema,
  PostSchema,
  SettingsSchema,
  WorkSchema,
  type AppEntry,
  type Note,
  type PackageEntry,
  type Post,
  type Settings,
  type Work,
} from "@/lib/schemas";

const tabs = ["Work", "Posts", "Apps", "Packages", "Notes", "Site"] as const;
type Tab = (typeof tabs)[number];

function Lines({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string[];
  onChange: (lines: string[]) => void;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Textarea
      label={label}
      name={name}
      value={text}
      helper="One item per line."
      onChange={(e) => setText(e.target.value)}
      onBlur={() =>
        onChange(
          text
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        )
      }
    />
  );
}

function DocEditor<T extends { slug: string }>({
  name,
  schema,
  empty,
  token,
  project,
  apiKey,
  label,
  children,
}: {
  name: string;
  schema: z.ZodType<T>;
  empty: T;
  token: string;
  project: string;
  apiKey: string;
  label: (doc: T) => string;
  children: (draft: T, set: (next: T) => void, key: string) => ReactNode;
}) {
  const [rows, setRows] = useState<{ id: string; doc: T }[]>([]);
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState("new");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function reload() {
    const listed = await listDocs(project, apiKey, name, token);
    setRows(
      listed.flatMap((row) => {
        const parsed = schema.safeParse({ slug: row.id, ...row.fields });
        return parsed.success ? [{ id: row.id, doc: parsed.data }] : [];
      }),
    );
  }

  useEffect(() => {
    let ignore = false;
    listDocs(project, apiKey, name, token)
      .then((listed) => {
        if (ignore) return;
        setLoaded(true);
        setRows(
          listed.flatMap((row) => {
            const parsed = schema.safeParse({ slug: row.id, ...row.fields });
            return parsed.success ? [{ id: row.id, doc: parsed.data }] : [];
          }),
        );
      })
      .catch(() => {
        if (!ignore) {
          setLoaded(true);
          setError("Could not load. Reload the page.");
        }
      });
    return () => {
      ignore = true;
    };
  }, [apiKey, name, project, schema, token]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the fields.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await saveDoc(project, apiKey, token, name, parsed.data.slug, parsed.data);
      setEditing(parsed.data.slug);
      await reload();
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete ${id}?`)) return;
    setError("");
    try {
      await deleteDoc(project, apiKey, token, name, id);
      if (editing === id) {
        setDraft(empty);
        setEditing("new");
      }
      await reload();
    } catch {
      setError("Could not delete. Try again.");
    }
  }

  return (
    <div className="grid gap-8 min-[900px]:grid-cols-[240px_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDraft(empty);
            setEditing("new");
            setError("");
          }}
        >
          New
        </Button>
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            aria-pressed={editing === row.id}
            onClick={() => {
              setDraft(row.doc);
              setEditing(row.id);
              setError("");
            }}
            className="min-h-11 rounded-md border border-line px-3 py-2 text-left text-small hover:border-line-strong aria-pressed:border-line-strong aria-pressed:bg-paper-raised"
          >
            {label(row.doc)}
          </button>
        ))}
      </div>
      {!loaded ? (
        <p className="text-ink-muted">Loading.</p>
      ) : (
        <form noValidate className="flex flex-col gap-4" onSubmit={(event) => void save(event)}>
          {error && (
            <p role="alert" className="text-small text-danger">
              {error}
            </p>
          )}
          {children(draft, setDraft, editing)}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={pending}>
              Save
            </Button>
            {editing !== "new" && (
              <Button type="button" variant="danger" onClick={() => void remove(editing)}>
                Delete
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function WorkForm({ draft, set, formKey }: { draft: Work; set: (next: Work) => void; formKey: string }) {
  return (
    <>
      <Input
        label="Slug"
        name="slug"
        required
        value={draft.slug}
        onChange={(e) => set({ ...draft, slug: e.target.value })}
      />
      <Input
        label="Order"
        name="order"
        type="number"
        required
        value={String(draft.order)}
        onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
      />
      <Input
        label="Eyebrow"
        name="eyebrow"
        required
        value={draft.eyebrow}
        onChange={(e) => set({ ...draft, eyebrow: e.target.value })}
      />
      <Input
        label="Title"
        name="title"
        required
        value={draft.title}
        onChange={(e) => set({ ...draft, title: e.target.value })}
      />
      <Input
        label="Accent"
        name="accent"
        required
        value={draft.accent}
        onChange={(e) => set({ ...draft, accent: e.target.value })}
      />
      <Textarea
        label="Lead"
        name="lead"
        required
        value={draft.lead}
        onChange={(e) => set({ ...draft, lead: e.target.value })}
      />
      <Input
        label="Teaser label"
        name="teaser-label"
        required
        value={draft.teaser.label}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, label: e.target.value } })}
      />
      <Input
        label="Teaser title"
        name="teaser-title"
        required
        value={draft.teaser.title}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, title: e.target.value } })}
      />
      <Textarea
        label="Teaser summary"
        name="teaser-summary"
        required
        value={draft.teaser.summary}
        onChange={(e) => set({ ...draft, teaser: { ...draft.teaser, summary: e.target.value } })}
      />
      {draft.stats.map((stat, i) => (
        <div key={i} className="grid gap-3 min-[900px]:grid-cols-2">
          <Input
            label={`Stat ${i + 1} label`}
            name={`stat-${i}-label`}
            required
            value={stat.label}
            onChange={(e) =>
              set({ ...draft, stats: draft.stats.map((row, n) => (n === i ? { ...row, label: e.target.value } : row)) })
            }
          />
          <Input
            label={`Stat ${i + 1} value`}
            name={`stat-${i}-value`}
            required
            value={stat.value}
            onChange={(e) =>
              set({ ...draft, stats: draft.stats.map((row, n) => (n === i ? { ...row, value: e.target.value } : row)) })
            }
          />
        </div>
      ))}
      <Input
        label="Problem title"
        name="problem-title"
        required
        value={draft.problemTitle}
        onChange={(e) => set({ ...draft, problemTitle: e.target.value })}
      />
      <Lines
        key={`${formKey}-problem`}
        label="Problem"
        name="problem"
        value={draft.problem}
        onChange={(problem) => set({ ...draft, problem })}
      />
      {draft.steps.map((step, i) => (
        <div key={i} className="grid gap-3">
          <Input
            label={`Step ${i + 1} title`}
            name={`step-${i}-title`}
            required
            value={step.title}
            onChange={(e) =>
              set({ ...draft, steps: draft.steps.map((row, n) => (n === i ? { ...row, title: e.target.value } : row)) })
            }
          />
          <Textarea
            label={`Step ${i + 1}`}
            name={`step-${i}-body`}
            required
            value={step.body}
            onChange={(e) =>
              set({ ...draft, steps: draft.steps.map((row, n) => (n === i ? { ...row, body: e.target.value } : row)) })
            }
          />
        </div>
      ))}
      <div className="flex gap-3">
        {draft.steps.length < 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => set({ ...draft, steps: [...draft.steps, { title: "", body: "" }] })}
          >
            Add step
          </Button>
        )}
        {draft.steps.length > 2 && (
          <Button type="button" variant="outline" onClick={() => set({ ...draft, steps: draft.steps.slice(0, -1) })}>
            Remove step
          </Button>
        )}
      </div>
      <Lines
        key={`${formKey}-checks`}
        label="Checks"
        name="checks"
        value={draft.checks ?? []}
        onChange={(checks) => set({ ...draft, checks: checks.length ? checks : undefined })}
      />
      <Input
        label="Result title"
        name="result-title"
        required
        value={draft.result.title}
        onChange={(e) => set({ ...draft, result: { ...draft.result, title: e.target.value } })}
      />
      <Textarea
        label="Result"
        name="result-body"
        required
        value={draft.result.body}
        onChange={(e) => set({ ...draft, result: { ...draft.result, body: e.target.value } })}
      />
      {draft.versions.map((version, i) => (
        <div key={i} className="grid gap-3 min-[900px]:grid-cols-2">
          <Input
            label={`From ${i + 1}`}
            name={`from-${i}`}
            required
            value={version.from}
            onChange={(e) =>
              set({
                ...draft,
                versions: draft.versions.map((row, n) => (n === i ? { ...row, from: e.target.value } : row)),
              })
            }
          />
          <Input
            label={`To ${i + 1}`}
            name={`to-${i}`}
            required
            value={version.to}
            onChange={(e) =>
              set({
                ...draft,
                versions: draft.versions.map((row, n) => (n === i ? { ...row, to: e.target.value } : row)),
              })
            }
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => set({ ...draft, versions: [...draft.versions, { from: "", to: "" }] })}
      >
        Add version
      </Button>
      <Lines
        key={`${formKey}-stack`}
        label="Stack"
        name="stack"
        value={draft.stack}
        onChange={(stack) => set({ ...draft, stack })}
      />
    </>
  );
}

const emptyWork = (): Work => ({
  slug: "",
  order: 1,
  eyebrow: "",
  title: "",
  accent: "",
  lead: "",
  teaser: { label: "", title: "", summary: "" },
  stats: [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ],
  problemTitle: "",
  problem: [],
  steps: [
    { title: "", body: "" },
    { title: "", body: "" },
  ],
  result: { title: "", body: "" },
  versions: [{ from: "", to: "" }],
  stack: [],
});

function Notes({ token, project, apiKey }: { token: string; project: string; apiKey: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function reload() {
    const listed = await listDocs(project, apiKey, "notes", token);
    const parsed = listed.flatMap((row) => {
      const note = NoteSchema.safeParse({ id: row.id, ...row.fields });
      return note.success ? [note.data] : [];
    });
    parsed.sort((a, b) => (a.received < b.received ? 1 : -1));
    setNotes(parsed);
  }

  useEffect(() => {
    let ignore = false;
    listDocs(project, apiKey, "notes", token)
      .then((listed) => {
        if (ignore) return;
        const parsed = listed.flatMap((row) => {
          const note = NoteSchema.safeParse({ id: row.id, ...row.fields });
          return note.success ? [note.data] : [];
        });
        parsed.sort((a, b) => (a.received < b.received ? 1 : -1));
        setNotes(parsed);
        setLoaded(true);
      })
      .catch(() => {
        if (!ignore) {
          setLoaded(true);
          setError("Could not load notes. Reload the page.");
        }
      });
    return () => {
      ignore = true;
    };
  }, [apiKey, project, token]);

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      )}
      {!loaded && !error && <p className="text-ink-muted">Loading.</p>}
      {loaded && notes.length === 0 && !error && <p className="text-ink-muted">No notes yet.</p>}
      {notes.map((note) => (
        <article key={note.id} className="flex flex-col gap-2 rounded-lg border border-line bg-paper-raised p-5">
          <p className="font-mono text-small text-ink-muted tabular-nums">
            {Number.isNaN(new Date(note.received).getTime())
              ? note.received
              : new Date(note.received).toLocaleString("en-GB", {
                  timeZone: "Asia/Kolkata",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </p>
          <h2 className="text-h2">{note.name}</h2>
          {note.offer && isOfferId(note.offer) && <span className="eyebrow text-brand">{offers[note.offer].name}</span>}
          <a href={`mailto:${note.email}`} className="text-brand underline-offset-4 hover:underline">
            {note.email}
          </a>
          <p className="whitespace-pre-wrap text-ink-muted">{note.message}</p>
          {note.link && (
            <a href={note.link} className="break-all text-brand underline-offset-4 hover:underline">
              {note.link}
            </a>
          )}
          <Button
            type="button"
            variant="danger"
            className="self-start"
            onClick={() => {
              if (!confirm("Delete this note?")) return;
              void deleteDoc(project, apiKey, token, "notes", note.id)
                .then(reload)
                .catch(() => setError("Could not delete. Try again."));
            }}
          >
            Delete
          </Button>
        </article>
      ))}
    </div>
  );
}

/** settings/site: notice banner and availability line. Shown on every page within 60s. */
function SiteSettings({ token, project, apiKey }: { token: string; project: string; apiKey: string }) {
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

  if (!draft) return <p className="text-ink-muted">{error || "Loading."}</p>;
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

export function AdminApp({ project, apiKey }: { project: string; apiKey: string }) {
  const [phase, setPhase] = useState<"form" | "sent" | "ready" | "wrong" | "confirm">("form");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [oob, setOob] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<Tab>("Work");

  function accept(idToken: string) {
    const claim = readToken(idToken);
    if (!claim || claim.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("admin-token");
      return;
    }
    if (!isAdmin(claim.email)) {
      sessionStorage.removeItem("admin-token");
      setPhase("wrong");
      return;
    }
    sessionStorage.setItem("admin-token", idToken);
    setToken(idToken);
    setPhase("ready");
  }

  async function finish(address: string, code: string) {
    setPending(true);
    setError("");
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address, oobCode: code }),
        },
      );
      const data = (await res.json()) as { idToken?: string };
      if (!res.ok || !data.idToken) {
        setError("That link is no longer valid. Send a new one.");
        setPhase("form");
        return;
      }
      history.replaceState(null, "", "/admin");
      accept(data.idToken);
    } catch {
      setError("Could not finish sign-in. Send a new link.");
      setPhase("form");
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (!project || !apiKey) return;
    const params = new URLSearchParams(location.search);
    const code = params.get("oobCode");
    if (code && params.get("mode") === "signIn") {
      const saved = localStorage.getItem("admin-email") ?? "";
      if (!saved) {
        queueMicrotask(() => {
          setOob(code);
          setPhase("confirm");
        });
        return;
      }
      queueMicrotask(() => void finish(saved, code));
      return;
    }
    const savedToken = sessionStorage.getItem("admin-token");
    if (savedToken) queueMicrotask(() => accept(savedToken));
    // Sign-in runs once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, apiKey]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!isAdmin(address)) {
      setPhase("wrong");
      return;
    }
    setPending(true);
    setError("");
    try {
      localStorage.setItem("admin-email", address);
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "EMAIL_SIGNIN",
            email: address,
            continueUrl: `${location.origin}/admin`,
            canHandleCodeInApp: true,
          }),
        },
      );
      if (!res.ok) {
        setError("Could not send the link. Turn on email-link sign-in, then try again.");
        return;
      }
      setPhase("sent");
    } catch {
      setError("Could not send the link. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (!project || !apiKey) {
    return (
      <>
        <h1 className="text-h1">Admin</h1>
        <p className="mt-4 text-ink-muted">Add the Firebase project id and API key, then reload.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-h1">Admin</h1>
      {phase === "wrong" && (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p role="alert" className="text-ink-muted">
            This page is for {ADMIN_EMAIL}.
          </p>
          <Button type="button" variant="outline" onClick={() => setPhase("form")}>
            Use a different email
          </Button>
        </div>
      )}
      {phase === "sent" && (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p className="text-ink-muted">Link sent. Open it in this browser.</p>
          <Button type="button" variant="outline" onClick={() => setPhase("form")}>
            Send another link
          </Button>
        </div>
      )}
      {(phase === "form" || phase === "confirm") && (
        <form
          noValidate
          className="mt-8 flex max-w-md flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (phase === "confirm") void finish(email, oob);
            else void send(event);
          }}
        >
          {error && (
            <p role="alert" className="text-small text-danger">
              {error}
            </p>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" loading={pending}>
            {phase === "confirm" ? "Finish sign-in" : "Send the link"}
          </Button>
        </form>
      )}
      {phase === "ready" && (
        <div className="mt-8 flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tab === item}
                onClick={() => setTab(item)}
                className={
                  tab === item
                    ? "min-h-11 rounded-pill border border-line-strong bg-paper-raised px-4 text-small"
                    : "min-h-11 rounded-pill border border-transparent px-4 text-small text-ink-muted"
                }
              >
                {item}
              </button>
            ))}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                sessionStorage.removeItem("admin-token");
                setToken("");
                setPhase("form");
              }}
            >
              Sign out
            </Button>
          </div>
          {tab === "Work" && (
            <DocEditor
              name="work"
              schema={WorkSchema}
              empty={emptyWork()}
              token={token}
              project={project}
              apiKey={apiKey}
              label={(doc) => doc.title || doc.slug}
            >
              {(draft, set, key) => <WorkForm draft={draft} set={set} formKey={key} />}
            </DocEditor>
          )}
          {tab === "Posts" && (
            <DocEditor
              name="posts"
              schema={PostSchema}
              empty={{ slug: "", date: "", title: "", summary: "", body: [] }}
              token={token}
              project={project}
              apiKey={apiKey}
              label={(doc: Post) => doc.title || doc.slug}
            >
              {(draft, set, key) => (
                <>
                  <Input
                    label="Slug"
                    name="slug"
                    required
                    value={draft.slug}
                    onChange={(e) => set({ ...draft, slug: e.target.value })}
                  />
                  <Input
                    label="Date"
                    name="date"
                    type="date"
                    required
                    value={draft.date}
                    onChange={(e) => set({ ...draft, date: e.target.value })}
                  />
                  <Input
                    label="Title"
                    name="title"
                    required
                    value={draft.title}
                    onChange={(e) => set({ ...draft, title: e.target.value })}
                  />
                  <Textarea
                    label="Summary"
                    name="summary"
                    required
                    value={draft.summary}
                    onChange={(e) => set({ ...draft, summary: e.target.value })}
                  />
                  <Lines
                    key={`${key}-body`}
                    label="Body"
                    name="body"
                    value={draft.body}
                    onChange={(body) => set({ ...draft, body })}
                  />
                </>
              )}
            </DocEditor>
          )}
          {tab === "Apps" && (
            <DocEditor
              name="apps"
              schema={AppSchema}
              empty={{
                slug: "",
                order: 1,
                name: "",
                initial: "",
                category: "",
                badge: "",
                summary: "",
                url: "",
                body: [],
              }}
              token={token}
              project={project}
              apiKey={apiKey}
              label={(doc: AppEntry) => doc.name || doc.slug}
            >
              {(draft, set, key) => (
                <>
                  <Input
                    label="Slug"
                    name="slug"
                    required
                    value={draft.slug}
                    onChange={(e) => set({ ...draft, slug: e.target.value })}
                  />
                  <Input
                    label="Order"
                    name="order"
                    type="number"
                    required
                    value={String(draft.order)}
                    onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
                  />
                  <Input
                    label="Name"
                    name="name"
                    required
                    value={draft.name}
                    onChange={(e) => set({ ...draft, name: e.target.value })}
                  />
                  <Input
                    label="Initial"
                    name="initial"
                    required
                    value={draft.initial}
                    onChange={(e) => set({ ...draft, initial: e.target.value })}
                  />
                  <Input
                    label="Category"
                    name="category"
                    required
                    value={draft.category}
                    onChange={(e) => set({ ...draft, category: e.target.value })}
                  />
                  <Input
                    label="Badge"
                    name="badge"
                    required
                    value={draft.badge}
                    onChange={(e) => set({ ...draft, badge: e.target.value })}
                  />
                  <Textarea
                    label="Summary"
                    name="summary"
                    required
                    value={draft.summary}
                    onChange={(e) => set({ ...draft, summary: e.target.value })}
                  />
                  <Input
                    label="Play URL"
                    name="url"
                    type="url"
                    required
                    value={draft.url}
                    onChange={(e) => set({ ...draft, url: e.target.value })}
                  />
                  <Lines
                    key={`${key}-body`}
                    label="Body"
                    name="body"
                    value={draft.body}
                    onChange={(body) => set({ ...draft, body })}
                  />
                </>
              )}
            </DocEditor>
          )}
          {tab === "Packages" && (
            <DocEditor
              name="packages"
              schema={PackageSchema}
              empty={{ slug: "", order: 1, name: "", summary: "", points: 0, body: [] }}
              token={token}
              project={project}
              apiKey={apiKey}
              label={(doc: PackageEntry) => doc.name || doc.slug}
            >
              {(draft, set, key) => (
                <>
                  <Input
                    label="Slug"
                    name="slug"
                    required
                    value={draft.slug}
                    onChange={(e) => set({ ...draft, slug: e.target.value })}
                  />
                  <Input
                    label="Order"
                    name="order"
                    type="number"
                    required
                    value={String(draft.order)}
                    onChange={(e) => set({ ...draft, order: Number(e.target.value) })}
                  />
                  <Input
                    label="Name"
                    name="name"
                    required
                    value={draft.name}
                    onChange={(e) => set({ ...draft, name: e.target.value })}
                  />
                  <Input
                    label="Points"
                    name="points"
                    type="number"
                    required
                    value={String(draft.points)}
                    onChange={(e) => set({ ...draft, points: Number(e.target.value) })}
                  />
                  <Textarea
                    label="Summary"
                    name="summary"
                    required
                    value={draft.summary}
                    onChange={(e) => set({ ...draft, summary: e.target.value })}
                  />
                  <Lines
                    key={`${key}-body`}
                    label="Body"
                    name="body"
                    value={draft.body}
                    onChange={(body) => set({ ...draft, body })}
                  />
                </>
              )}
            </DocEditor>
          )}
          {tab === "Notes" && <Notes token={token} project={project} apiKey={apiKey} />}
          {tab === "Site" && <SiteSettings token={token} project={project} apiKey={apiKey} />}
        </div>
      )}
    </>
  );
}
