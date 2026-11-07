"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AppCard } from "@/components/site/AppCard";
import { WorkCards } from "@/components/site/WorkCards";
import { AppSchema, PackageSchema, PostSchema, WorkSchema } from "@/lib/schemas";
import { DocEditor } from "./DocEditor";
import { useConfirm } from "./Fields";
import { AppForm, emptyApp, emptyPackage, emptyPost, emptyWork, PackageForm, PostForm, WorkForm } from "./forms";
import { Notes } from "./Notes";
import { SignIn } from "./SignIn";
import { SiteSettings } from "./SiteSettings";

const tabs = ["Work", "Posts", "Apps", "Packages", "Notes", "Site"] as const;
type Tab = (typeof tabs)[number];

export function AdminApp({ project, apiKey, bucket }: { project: string; apiKey: string; bucket: string }) {
  const [tab, setTabState] = useState<Tab>("Work");
  const [dirty, setDirty] = useState(false);
  const { ask, dialog } = useConfirm();

  // ?tab= survives reload. Replace, never push.
  useEffect(() => {
    const wanted = new URLSearchParams(location.search).get("tab");
    if (wanted && (tabs as readonly string[]).includes(wanted)) queueMicrotask(() => setTabState(wanted as Tab));
  }, []);

  async function guard() {
    return !dirty || (await ask("Discard unsaved changes?", "Discard"));
  }

  async function setTab(next: Tab) {
    if (next === tab || !(await guard())) return;
    setDirty(false);
    setTabState(next);
    const url = new URL(location.href);
    url.searchParams.set("tab", next);
    url.searchParams.delete("id");
    history.replaceState(null, "", url);
  }

  return (
    <SignIn project={project} apiKey={apiKey}>
      {(token, signOut) => {
        const common = { token, project, apiKey, bucket, onDirty: setDirty };
        return (
          <div className="mt-8 flex flex-col gap-8">
            <nav aria-label="Sections" className="flex flex-wrap items-center gap-2">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={tab === item}
                  onClick={() => void setTab(item)}
                  className={
                    tab === item
                      ? "min-h-11 rounded-pill border border-line-strong bg-paper-raised px-4 text-small"
                      : "min-h-11 rounded-pill border border-transparent px-4 text-small text-ink-muted hover:bg-paper-raised"
                  }
                >
                  {item}
                </button>
              ))}
              <Button
                type="button"
                variant="ghost"
                className="ml-auto"
                onClick={() => {
                  void guard().then((ok) => ok && signOut());
                }}
              >
                Sign out
              </Button>
            </nav>
            {dialog}
            {tab === "Work" && (
              <DocEditor
                {...common}
                name="work"
                schema={WorkSchema}
                empty={emptyWork}
                columns={[
                  { label: "Title", value: (d) => d.title },
                  { label: "Slug", value: (d) => d.slug },
                  { label: "Order", value: (d) => d.order },
                ]}
                Form={WorkForm}
                preview={(d) => <WorkCards items={[d]} />}
              />
            )}
            {tab === "Posts" && (
              <DocEditor
                {...common}
                name="posts"
                schema={PostSchema}
                empty={emptyPost}
                columns={[
                  { label: "Title", value: (d) => d.title },
                  { label: "Slug", value: (d) => d.slug },
                  { label: "Date", value: (d) => d.date },
                ]}
                Form={PostForm}
              />
            )}
            {tab === "Apps" && (
              <DocEditor
                {...common}
                name="apps"
                schema={AppSchema}
                empty={emptyApp}
                columns={[
                  { label: "Name", value: (d) => d.name },
                  { label: "Slug", value: (d) => d.slug },
                  { label: "Order", value: (d) => d.order },
                ]}
                Form={AppForm}
                preview={(d) => (
                  <ul className="grid max-w-xs">
                    <AppCard app={d} />
                  </ul>
                )}
              />
            )}
            {tab === "Packages" && (
              <DocEditor
                {...common}
                name="packages"
                schema={PackageSchema}
                empty={emptyPackage}
                columns={[
                  { label: "Name", value: (d) => d.name },
                  { label: "Slug", value: (d) => d.slug },
                  { label: "Points", value: (d) => d.points },
                ]}
                Form={PackageForm}
              />
            )}
            {tab === "Notes" && <Notes token={token} project={project} apiKey={apiKey} />}
            {tab === "Site" && <SiteSettings token={token} project={project} apiKey={apiKey} />}
          </div>
        );
      }}
    </SignIn>
  );
}
