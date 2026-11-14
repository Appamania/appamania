// Fallback for the in-development panel. Work, apps, and packages live in content/snapshot.json.

export const inDevelopment = {
  name: "Network.",
  summary: "A mobile strategy game about building and defending the infrastructure that keeps the internet running.",
} as const;

export const pubUrl = (name: string) => `https://pub.dev/packages/${name}`;
