// Firebase Storage REST upload for admin. Public URLs need no token: storage.rules allows read on media/.

export const MEDIA_HOST = "https://firebasestorage.googleapis.com/";

export function mediaUrl(bucket: string, name: string) {
  return `${MEDIA_HOST}v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(name)}?alt=media`;
}

/** Safe object name: slug prefix, timestamp, original extension. */
export function objectName(prefix: string, fileName: string, now = Date.now()) {
  const ext = fileName.includes(".")
    ? (fileName.split(".").pop() ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 5)
    : "";
  const base =
    prefix
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "file";
  return `media/${base}-${now}${ext ? `.${ext}` : ""}`;
}

export async function uploadFile(bucket: string, token: string, file: File, prefix: string): Promise<string> {
  const name = objectName(prefix, file.name);
  const url = `${MEDIA_HOST}v0/b/${encodeURIComponent(bucket)}/o?name=${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Firebase ${token}`, "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error("Could not upload");
  return mediaUrl(bucket, name);
}
