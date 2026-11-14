// Firestore REST client. No SDK, no zod: this file ships to the browser for the note form.

type FsValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { arrayValue: { values?: FsValue[] } }
  | { mapValue: { fields?: Record<string, FsValue> } };

export function encodeValue(value: unknown): FsValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === "object") {
    const fields: Record<string, FsValue> = {};
    for (const [key, inner] of Object.entries(value)) if (inner !== undefined) fields[key] = encodeValue(inner);
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

export function encodeFields(data: Record<string, unknown>) {
  const fields: Record<string, FsValue> = {};
  for (const [key, value] of Object.entries(data)) if (value !== undefined) fields[key] = encodeValue(value);
  return fields;
}

function projectUrl(project: string, suffix: string) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents${suffix}`;
}

export async function createNote(
  project: string,
  key: string,
  note: { name: string; email: string; message: string; link: string; offer: string },
) {
  const url = new URL(projectUrl(project, "/notes"));
  url.searchParams.set("key", key);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encodeFields({ ...note, received: new Date().toISOString() }) }),
  });
  if (!res.ok) throw new Error("Could not save the note");
}
