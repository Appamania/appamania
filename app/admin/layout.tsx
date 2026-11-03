import { FolderKanban, Inbox, LayoutDashboard, Receipt, BarChart3 } from "lucide-react";
import { AppShell, type NavItem } from "@/components/portal/AppShell";
import { requireAdmin } from "@/lib/auth";

export { generateViewport } from "@/components/portal/appTheme";

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

// requireAdmin: admin role + aal2 (E3.3). RLS enforces the same in the DB.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AppShell nav={nav}>{children}</AppShell>;
}
