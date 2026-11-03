import { FileText, FolderOpen, LayoutDashboard, MessageSquare, Receipt } from "lucide-react";
import { AppShell, type NavItem } from "@/components/portal/AppShell";
import { requireClient } from "@/lib/auth";

export { generateViewport } from "@/components/portal/appTheme";

const nav: NavItem[] = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/updates", label: "Updates", icon: MessageSquare },
  { href: "/portal/requests", label: "Requests", icon: FileText },
  { href: "/portal/files", label: "Files", icon: FolderOpen },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireClient();
  return <AppShell nav={nav}>{children}</AppShell>;
}
