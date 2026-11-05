import type { Metadata } from "next";
import { FolderKanban } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";
import { Progress } from "@/components/ui/Progress";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Overview" };

// D1 placeholder overview: proves the session and RLS end to end. Full screen (canvas ClientDashboard) lands in D4.
export default async function PortalHome() {
  const viewer = await getViewer();
  const supabase = await createClient();
  const [{ data: projects }, { data: progress }] = await Promise.all([
    supabase.from("projects").select("id, title, status").order("created_at"),
    supabase.from("project_progress").select("project_id, progress"),
  ]);
  const pct = new Map(progress?.map((p) => [p.project_id, p.progress ?? 0]));
  return (
    <div className="grid gap-6">
      <h1 className="text-h1">Hi{viewer?.fullName ? `, ${viewer.fullName.split(" ")[0]}` : ""}</h1>
      {projects?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id} className="grid gap-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-h2">{p.title}</h2>
                <StatusPill domain="project" value={p.status} />
              </div>
              <Progress value={pct.get(p.id) ?? 0} label={`${p.title} progress`} />
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={FolderKanban} title="No projects yet" body="Your project appears here once work is booked." />
      )}
    </div>
  );
}
