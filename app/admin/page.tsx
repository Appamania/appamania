import type { Metadata } from "next";
import { StatCard } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

// D1 placeholder: proves aal2 admin reads. Full dashboard (canvas AdminDashboard) lands in D5.
export default async function AdminHome() {
  const supabase = await createClient();
  const count = (table: "projects" | "leads" | "clients") =>
    supabase.from(table).select("id", { count: "exact", head: true }).then((r) => r.count ?? 0);
  const [projects, leads, clients] = await Promise.all([count("projects"), count("leads"), count("clients")]);
  return (
    <div className="grid gap-6">
      <h1 className="text-h1">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Clients" value={clients} />
        <StatCard label="Projects" value={projects} />
        <StatCard label="Leads" value={leads} />
      </div>
    </div>
  );
}
