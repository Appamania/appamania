import { z } from "zod";

export const ADMIN_EMAIL = "sumit@appamania.in";

export function isAdmin(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const paragraphs = z.array(z.string().min(1));

export const WorkSchema = z.object({
  slug,
  order: z.number().int(),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  accent: z.string().min(1),
  lead: z.string().min(1),
  teaser: z.object({ label: z.string().min(1), title: z.string().min(1), summary: z.string().min(1) }),
  stats: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).length(3),
  problemTitle: z.string().min(1),
  problem: paragraphs.min(1),
  steps: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).min(2).max(4),
  checks: z.array(z.string().min(1)).optional(),
  result: z.object({ title: z.string().min(1), body: z.string().min(1) }),
  versions: z.array(z.object({ from: z.string().min(1), to: z.string().min(1) })).min(1),
  stack: z.array(z.string().min(1)).min(1),
});

export const PostSchema = z.object({
  slug,
  date: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: paragraphs.min(1),
});

export const AppSchema = z.object({
  slug,
  order: z.number().int(),
  name: z.string().min(1),
  initial: z.string().min(1).max(3),
  category: z.string().min(1),
  badge: z.string().min(1),
  summary: z.string().min(1),
  url: z.string().regex(/^https?:\/\//),
  body: paragraphs.min(1),
});

export const PackageSchema = z.object({
  slug,
  order: z.number().int(),
  name: z.string().min(1),
  summary: z.string().min(1),
  points: z.number().int().nonnegative(),
  body: paragraphs.min(1),
});

export const NoteSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  link: z.string(),
  received: z.string(),
});

export const StaticCopy = z.object({
  hero: z.object({
    before: z.string().min(1),
    after: z.string().min(1),
    accent: z.string().min(1),
    lead: z.string().min(1),
    primary: z.string().min(1),
    secondary: z.string().min(1),
  }),
  stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
  floats: z.object({
    upgradeEyebrow: z.string().min(1),
    upgradeValue: z.string().min(1),
    upgradeCaption: z.string().min(1),
    ci: z.string().min(1),
  }),
  stack: z.array(z.string().min(1)).min(1),
  inDevelopment: z.object({ name: z.string().min(1), summary: z.string().min(1) }),
});

export type Work = z.infer<typeof WorkSchema>;
export type Post = z.infer<typeof PostSchema>;
export type AppEntry = z.infer<typeof AppSchema>;
export type PackageEntry = z.infer<typeof PackageSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type HomeCopy = z.infer<typeof StaticCopy>;

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

/** Skip a bad document. If every document is bad, keep the snapshot so one broken row does not blank the page. */
export function chooseList<T>(remote: unknown[] | null, schema: z.ZodType<T>, fallback: T[]): T[] {
  if (!remote) return fallback;
  const parsed = remote.flatMap((doc) => {
    const result = schema.safeParse(doc);
    return result.success ? [result.data] : [];
  });
  if (remote.length > 0 && parsed.length === 0) return fallback;
  return parsed;
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

export type RemoteInput = {
  version: string;
  notice: string;
  staticJson: string;
  refresh: string;
  built: string;
  reloadedFor: string | null;
};

export type RemoteDecision = { notice: string; copy: HomeCopy | null; reload: boolean; mark: string | null };

/** One reload per version. A second pass shows the banner, because a reload cannot change the baked build. */
export function decideRemote(input: RemoteInput): RemoteDecision {
  let copy: HomeCopy | null = null;
  if (input.staticJson.trim()) {
    try {
      const parsed = StaticCopy.safeParse(JSON.parse(input.staticJson));
      if (parsed.success) copy = parsed.data;
    } catch {
      copy = null;
    }
  }
  const version = input.version.trim();
  const refresh = input.refresh.trim() === "true";
  const mismatch = version !== "" && version !== input.built.trim();
  const mark = version || (refresh ? "refresh" : "");
  const reload = (refresh || mismatch) && mark !== "" && input.reloadedFor !== mark;
  let notice = input.notice.trim();
  if (!reload && mismatch && !notice) notice = "This page has a newer version.";
  return { notice, copy, reload, mark: reload ? mark : null };
}

type Listed = { id: string; fields: Record<string, unknown> };

function projectUrl(project: string, suffix: string) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents${suffix}`;
}

export async function listDocs(project: string, key: string, collection: string, token?: string): Promise<Listed[]> {
  const out: Listed[] = [];
  let pageToken = "";
  do {
    const url = new URL(projectUrl(project, `/${collection}`));
    url.searchParams.set("key", key);
    url.searchParams.set("pageSize", "300"); // ponytail: one page of 300, follow the token if a collection outgrows it
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
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

export async function createNote(project: string, key: string, note: { name: string; email: string; message: string; link: string }) {
  const url = new URL(projectUrl(project, "/notes"));
  url.searchParams.set("key", key);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: encodeFields({ ...note, received: new Date().toISOString() }) }),
  });
  if (!res.ok) throw new Error("Could not save the note");
}

export async function fetchRemoteConfig(project: string, key: string, appId: string) {
  const storageKey = "rc-instance";
  const existing = localStorage.getItem(storageKey);
  const appInstanceId = existing || crypto.randomUUID();
  if (!existing) localStorage.setItem(storageKey, appInstanceId);
  const res = await fetch(
    `https://firebaseremoteconfig.googleapis.com/v1/projects/${encodeURIComponent(project)}/namespaces/firebase:fetch?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appInstanceId, appId, appVersion: "1", platformVersion: "web", sdkVersion: "0", languageCode: "en" }),
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { entries?: Record<string, string> };
  const entries = data.entries ?? {};
  return { version: entries.version ?? "", notice: entries.notice ?? "", staticJson: entries.static ?? "", refresh: entries.refresh ?? "" };
}
