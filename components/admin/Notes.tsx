"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isOfferId, offers } from "@/config/offers";
import { deleteDoc, listDocs } from "@/lib/firestore";
import { NoteSchema, type Note } from "@/lib/schemas";
import { useConfirm } from "./Fields";

export function Notes({ token, project, apiKey }: { token: string; project: string; apiKey: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { ask, dialog } = useConfirm();

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
      {dialog}
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
            <a
              href={note.link}
              rel="noopener noreferrer nofollow"
              className="break-all text-brand underline-offset-4 hover:underline"
            >
              {note.link}
            </a>
          )}
          <Button
            type="button"
            variant="danger"
            className="self-start"
            onClick={() => {
              void ask(`Delete the note from ${note.name}?`).then((ok) => {
                if (!ok) return;
                return deleteDoc(project, apiKey, token, "notes", note.id)
                  .then(reload)
                  .catch(() => setError("Could not delete. Try again."));
              });
            }}
          >
            Delete
          </Button>
        </article>
      ))}
    </div>
  );
}
