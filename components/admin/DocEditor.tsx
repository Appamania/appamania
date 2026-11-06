"use client";

import { Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { controlStyles } from "@/components/ui/Field";
import { deleteDoc, listDocs, saveDoc } from "@/lib/firestore";
import { cx } from "@/lib/cx";
import { useConfirm, type Media } from "./Fields";
import type { FormProps } from "./forms";

type Row<T> = { id: string; doc: T };

export type Column<T> = { label: string; value: (doc: T) => ReactNode; numeric?: boolean };

/**
 * Table-first editor for one collection: search, rows, then a form with optional live preview.
 * Unsaved edits block navigation (beforeunload) and the back button asks first. Cmd/Ctrl+S saves.
 */
export function DocEditor<T extends { slug: string }>({
  name,
  schema,
  empty,
  token,
  project,
  apiKey,
  bucket,
  columns,
  Form,
  preview,
  onDirty,
}: {
  name: string;
  schema: z.ZodType<T>;
  empty: () => T;
  token: string;
  project: string;
  apiKey: string;
  bucket: string;
  columns: Column<T>[];
  Form: (props: FormProps<T>) => ReactNode;
  preview?: (draft: T) => ReactNode;
  /** Lets the shell guard tab switches and sign-out while edits are unsaved. */
  onDirty?: (dirty: boolean) => void;
}) {
  const [rows, setRows] = useState<Row<T>[] | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null); // null = list, "new" = new doc, else id
  const [draft, setDraft] = useState<T>(empty);
  const [dirty, setDirtyState] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { ask, dialog } = useConfirm();
  const media: Media = { token, bucket };

  function setDirty(next: boolean) {
    setDirtyState(next);
    onDirty?.(next);
  }

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
        setRows(
          listed.flatMap((row) => {
            const parsed = schema.safeParse({ slug: row.id, ...row.fields });
            return parsed.success ? [{ id: row.id, doc: parsed.data }] : [];
          }),
        );
      })
      .catch(() => {
        if (!ignore) {
          setRows([]);
          setError("Could not load. Reload the page.");
        }
      });
    return () => {
      ignore = true;
    };
  }, [apiKey, name, project, schema, token]);

  // ?id= holds the open document so reload keeps the place. Replace, never push.
  useEffect(() => {
    const url = new URL(location.href);
    if (editing === null) url.searchParams.delete("id");
    else url.searchParams.set("id", editing);
    history.replaceState(null, "", url);
  }, [editing]);

  useEffect(() => {
    if (rows === null) return;
    const id = new URLSearchParams(location.search).get("id");
    if (!id || editing !== null) return;
    const row = rows.find((r) => r.id === id);
    if (row) open(row.id, row.doc);
    else if (id === "new") open("new", empty());
    // Runs once the list has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function open(id: string, doc: T) {
    setDraft(doc);
    setEditing(id);
    setDirty(false);
    setError("");
    setErrors({});
  }

  async function back() {
    if (dirty && !(await ask("Discard unsaved changes?", "Discard"))) return;
    setEditing(null);
    setDirty(false);
    setError("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(draft);
    if (!parsed.success) {
      const byField: Record<string, string> = {};
      const nested: string[] = [];
      for (const issue of parsed.error.issues) {
        const [head, ...rest] = issue.path.map(String);
        if (!head) continue;
        if (rest.length === 0 || typeof head === "number") byField[head] ??= issue.message;
        else nested.push(`${[head, ...rest].join(".")}: ${issue.message}`);
      }
      setErrors(byField);
      setError(nested[0] ?? (Object.keys(byField).length ? "Fix the fields marked below." : "Check the fields."));
      return;
    }
    setPending(true);
    setError("");
    setErrors({});
    try {
      await saveDoc(project, apiKey, token, name, parsed.data.slug, parsed.data);
      setEditing(parsed.data.slug);
      setDirty(false);
      await reload();
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    if (!(await ask(`Delete ${id}? This cannot be undone.`))) return;
    setError("");
    try {
      await deleteDoc(project, apiKey, token, name, id);
      setEditing(null);
      setDirty(false);
      await reload();
    } catch {
      setError("Could not delete. Try again.");
    }
  }

  if (rows === null) return <p className="text-ink-muted">Loading.</p>;

  if (editing === null) {
    const q = query.trim().toLowerCase();
    const shown = q ? rows.filter((r) => JSON.stringify(r.doc).toLowerCase().includes(q)) : rows;
    return (
      <div className="flex flex-col gap-4">
        {dialog}
        {error && (
          <p role="alert" className="text-small text-danger">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative grow">
            <span className="sr-only">Search {name}</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${name}`}
              className={cx(controlStyles, "h-11 pl-9")}
            />
          </label>
          <Button type="button" onClick={() => open("new", empty())}>
            Add new
          </Button>
        </div>
        {shown.length === 0 ? (
          <p className="flex items-center gap-3 text-ink-muted">
            {rows.length === 0 ? `No ${name} yet. Add the first one.` : "No match."}
            {rows.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setQuery("")}>
                Clear search
              </Button>
            )}
          </p>
        ) : (
          <table className="w-full border-collapse text-small">
            <thead>
              <tr className="text-left text-ink-muted">
                {columns.map((c) => (
                  <th
                    key={c.label}
                    scope="col"
                    className={cx("border-b border-line py-2 pr-4 eyebrow font-medium", c.numeric && "text-right")}
                  >
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="border-b border-line" />
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id} className="border-b border-line">
                  {columns.map((c, i) => (
                    <td
                      key={c.label}
                      className={cx(
                        "py-2.5 pr-4 align-top",
                        i === 0 && "font-medium text-ink",
                        c.numeric && "text-right font-mono tabular-nums",
                      )}
                    >
                      {c.value(row.doc)}
                    </td>
                  ))}
                  <td className="py-1.5 text-right">
                    <Button type="button" variant="ghost" size="sm" onClick={() => open(row.id, row.doc)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className={cx("grid gap-8", preview && "min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]")}>
      {dialog}
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => void save(event)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => void back()}>
            Back to {name}
          </Button>
          <span role="status" className="font-mono text-small text-ink-muted">
            {editing === "new" ? "New" : editing}
            {dirty ? " · unsaved" : ""}
          </span>
        </div>
        {error && (
          <p role="alert" className="text-small text-danger">
            {error}
          </p>
        )}
        <Form
          draft={draft}
          formKey={editing}
          media={media}
          errors={errors}
          set={(next) => {
            setDraft(next);
            setDirty(true);
          }}
        />
        <div className="sticky bottom-0 z-(--z-nav) flex flex-wrap gap-3 border-t border-line bg-paper pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
      {preview && (
        <aside aria-label="Preview" className="min-[1100px]:sticky min-[1100px]:top-6 min-[1100px]:self-start">
          <p className="mb-3 eyebrow text-ink-muted">Preview</p>
          <div className="max-w-sm rounded-lg border border-line p-4">{preview(draft)}</div>
        </aside>
      )}
    </div>
  );
}
