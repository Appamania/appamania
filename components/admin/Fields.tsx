"use client";

import { X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";
import { uploadFile } from "@/lib/storage";

export type Media = { token: string; bucket: string };

/** One item per line, committed on blur. */
export function Lines({
  label,
  name,
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  value: string[];
  error?: string;
  onChange: (lines: string[]) => void;
}) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <Textarea
      label={label}
      name={name}
      value={text}
      helper="One item per line."
      required
      error={error}
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

/** Upload to Firebase Storage. `value` holds public URLs; `max` 1 means a single file. */
export function Upload({
  label,
  name,
  prefix,
  media,
  accept,
  value,
  max = 1,
  error,
  onChange,
}: {
  label: string;
  name: string;
  prefix: string;
  media: Media;
  accept: "image/*" | "video/mp4";
  value: string[];
  max?: number;
  error?: string;
  onChange: (urls: string[]) => void;
}) {
  const [pending, setPending] = useState(false);
  const [uploadError, setError] = useState("");
  const full = value.length >= max;
  return (
    <Field
      id={name}
      label={label}
      message={uploadError || error}
      helper={
        !media.bucket
          ? "Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET to upload."
          : pending
            ? "Uploading."
            : [
                accept === "video/mp4" ? "MP4 under 50 MB." : "Images under 5 MB.",
                max > 1 && `Up to ${max}.`,
                full && "Remove one to add another.",
              ]
                .filter(Boolean)
                .join(" ")
      }
    >
      <ul className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <li key={url} className="relative">
            {accept === "video/mp4" ? (
              <video src={url} muted className="h-24 rounded-sm border border-line bg-paper-sunken" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview of an unsized upload
              <img src={url} alt="" className="h-24 rounded-sm border border-line bg-paper-sunken object-cover" />
            )}
            <button
              type="button"
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
              onClick={() => onChange(value.filter((v) => v !== url))}
              className="absolute -top-2 -right-2 grid size-8 place-items-center rounded-pill border border-line-strong bg-paper text-ink pointer-coarse:size-11"
            >
              <X aria-hidden className="size-4" />
            </button>
          </li>
        ))}
        <li>
          <input
            id={name}
            type="file"
            accept={accept}
            disabled={pending || full || !media.bucket}
            aria-busy={pending || undefined}
            className="block text-small text-ink-muted file:mr-3 file:h-11 file:rounded-pill file:border file:border-line-strong file:bg-paper-raised file:px-3.5 file:text-small file:text-ink disabled:opacity-50"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setPending(true);
              setError("");
              try {
                onChange([...value, await uploadFile(media.bucket, media.token, file, prefix)]);
              } catch {
                setError("Upload failed. Check the file size and type, then try again.");
              } finally {
                setPending(false);
              }
            }}
          />
        </li>
      </ul>
    </Field>
  );
}

/** Native <dialog> confirm. `ask(text)` resolves true on confirm. */
export function useConfirm() {
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<(ok: boolean) => void>(() => undefined);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("Delete");
  function ask(message: string, confirmLabel = "Delete") {
    setText(message);
    setLabel(confirmLabel);
    ref.current?.showModal();
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }
  function close(ok: boolean) {
    ref.current?.close();
    resolver.current(ok);
  }
  const dialog: ReactNode = (
    <dialog
      ref={ref}
      aria-label="Confirm"
      onClose={() => resolver.current(false)}
      className="m-auto max-w-sm rounded-lg border border-line bg-paper p-6 text-ink backdrop:bg-overlay"
    >
      <p>{text}</p>
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => close(false)}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={() => close(true)}>
          {label}
        </Button>
      </div>
    </dialog>
  );
  return { ask, dialog };
}
