// Firestore REST client. No SDK, no zod: this file ships to the browser for the note form and admin.

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

export function readToken(idToken: string): { email: string; exp: number } | null {
  const part = idToken.split(".")[1];
  if (!part) return null;
  try {
    const pad = part.length % 4 === 0 ? "" : "=".repeat(4 - (part.length % 4));
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/") + pad)) as { email?: unknown; exp?: unknown };
    if (typeof json.email !== "string" || typeof json.exp !== "number") return null;
    return { email: json.email, exp: json.exp };
  } catch {
    return null;
  }
}

type Listed = { id: string; fields: Record<string, unknown> };

function projectUrl(project: string, suffix: string) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents${suffix}`;
}

// Admin reads stay fresh. Public reads are cached for 60s to match the page revalidate.
function readInit(token?: string): RequestInit {
  return token ? { cache: "no-store", headers: { Authorization: `Bearer ${token}` } } : { next: { revalidate: 60 } };
}

export async function listDocs(project: string, key: string, collection: string, token?: string): Promise<Listed[]> {
  const out: Listed[] = [];
  let pageToken = "";
  do {
    const url = new URL(projectUrl(project, `/${collection}`));
    url.searchParams.set("key", key);
    url.searchParams.set("pageSize", "300"); // ponytail: one page of 300, follow the token if a collection outgrows it
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, readInit(token));
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

/** One document's fields, or null when it does not exist. */
export async function getDoc(project: string, key: string, path: string, token?: string): Promise<Record<string, unknown> | null> {
  const url = new URL(projectUrl(project, `/${path}`));
  url.searchParams.set("key", key);
  const res = await fetch(url, readInit(token));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not load ${path}`);
  const data = (await res.json()) as { fields?: Record<string, FsValue> };
  return decodeFields(data.fields ?? {});
}

export async function saveDoc(project: string, key: string, token: string, collection: string, id: string, data: Record<string, unknown>) {
  const url = new URL(projectUrl(project, `/${collection}/${encodeURIComponent(id)}`));
  url.searchParams.set("key", key);
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
  if (!res.ok) throw new Error("Could not save");
}

export async function deleteDoc(project: string, key: string, token: string, collection: string, id: string) {
  const url = new URL(projectUrl(project, `/${collection}/${encodeURIComponent(id)}`));
  url.searchParams.set("key", key);
  const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Could not delete");
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
