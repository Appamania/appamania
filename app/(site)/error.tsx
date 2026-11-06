"use client";

import { Button } from "@/components/ui/Button";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 pt-24">
      <span className="eyebrow text-brand">Error</span>
      <h1 className="text-display">This page did not render.</h1>
      <p className="max-w-[46ch] text-ink-muted">Try again. If it keeps failing, email sumit@appamania.in with the link.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
