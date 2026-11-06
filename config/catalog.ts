// Fallback for the stack marquee and the in-development panel. Remote Config `static` overrides both.
// Apps and packages live in Firestore.

export const stack = [
  "Flutter",
  "Dart",
  "Riverpod",
  "BLoC",
  "Clean Architecture",
  "Supabase",
  "Firebase",
  "GitHub Actions",
  "Kotlin",
  "Swift",
  "Play Store",
  "App Store",
] as const;

export const inDevelopment = {
  name: "Network.",
  summary: "A mobile strategy game about building and defending the infrastructure that keeps the internet running.",
} as const;

export const pubUrl = (name: string) => `https://pub.dev/packages/${name}`;
