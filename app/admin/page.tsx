import { AdminApp } from "@/components/admin/AdminApp";

export default function AdminPage() {
  return (
    <AdminApp
      project={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}
      apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ""}
      bucket={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ""}
    />
  );
}
