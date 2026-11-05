// Apps and open-source packages (PRD E1.5). Facts only; numbers as shown on Play and pub.dev.

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

export const apps = [
  {
    name: "Spend Analytics",
    initial: "S",
    category: "Finance",
    badge: "5.0 · 50+ installs",
    summary: "Offline-first spend tracker with smart limits and real-time charts.",
    url: "https://play.google.com/store/apps/details?id=com.sumit.spofficial.spend_analytics",
  },
  {
    name: "Medify",
    initial: "M",
    category: "Health",
    badge: "Live",
    summary: "Medication reminders and a simple routine tracker.",
    url: "https://play.google.com/store/apps/details?id=com.sumit.medify",
  },
  {
    name: "Minimalist Forecast",
    initial: "F",
    category: "Weather",
    badge: "Live",
    summary: "A weather app with a quiet, minimal interface.",
    url: "https://play.google.com/store/apps/details?id=appamania.sumit.flutter_forecast",
  },
  {
    name: "Wally — The Stupid",
    initial: "W",
    category: "Casual",
    badge: "Live",
    summary: "Not smart. Not useful. Strangely cheerful.",
    url: "https://play.google.com/store/apps/details?id=in.appa_mania.wally_the_stupid",
  },
] as const;

export const inDevelopment = {
  name: "Network.",
  summary: "A mobile strategy game about building and defending the infrastructure that keeps the internet running.",
} as const;

export const packages = [
  { name: "envified", summary: "Runtime dev/prod switching with integrity checks and biometric gating.", points: 160 },
  { name: "drip_flutter", summary: "Zero-rebuild UI updates through direct RenderObject synchronisation.", points: 160 },
  { name: "screenx", summary: "Responsive breakpoints and sp/dp converters for Android, iOS and Web.", points: 160 },
] as const;

export const pubUrl = (name: string) => `https://pub.dev/packages/${name}`;
