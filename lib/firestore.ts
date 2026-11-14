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

export function decodeValue(value: FsValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in value) {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value.mapValue.fields ?? {})) out[key] = decodeValue(inner);
    return out;
  }
  return null;
}

export function encodeFields(data: Record<string, unknown>) {
  const fields: Record<string, FsValue> = {};
  for (const [key, value] of Object.entries(data)) if (value !== undefined) fields[key] = encodeValue(value);
  return fields;
}

export function decodeFields(fields: Record<string, FsValue>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) out[key] = decodeValue(value);
  return out;
}

type Listed = { id: string; fields: Record<string, unknown> };

function projectUrl(project: string, suffix: string) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents${suffix}`;
}

export async function listDocs(project: string, key: string, collection: string): Promise<Listed[]> {
  const out: Listed[] = [];
  let pageToken = "";
  do {
    const url = new URL(projectUrl(project, `/${collection}`));
    url.searchParams.set("key", key);
    url.searchParams.set("pageSize", "300"); // ponytail: one page of 300, follow the token if a collection outgrows it
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Could not load ${collection}`);
    const data = (await res.json()) as {
      documents?: { name: string; fields?: Record<string, FsValue> }[];
      nextPageToken?: string;
    };
    for (const doc of data.documents ?? []) {
      out.push({ id: decodeURIComponent(doc.name.split("/").pop() ?? ""), fields: decodeFields(doc.fields ?? {}) });
    }
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return out;
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
