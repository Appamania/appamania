import type { Metadata } from "next";
import { NoteForm } from "@/components/site/NoteForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Send a note",
  description: `Send a note to ${site.owner}. It is saved in a Google Sheet and used only to reply.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="relative grid items-start gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22">
      <div className="relative flex flex-col gap-6">
        <h1 className="text-[clamp(52px,7vw,104px)] leading-[0.92] font-semibold tracking-[-0.055em]">
          Send a <span className="text-brand">note.</span>
        </h1>
        <p className="max-w-[46ch] text-body-lg text-ink-muted">
          A question about the write-ups, the apps, or the packages. I read every row myself.
        </p>
        <p className="font-mono text-[13px] text-ink-muted">
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4 hover:text-brand">
            {site.email}
          </a>{" "}
          · Kolkata, IST (UTC+5:30)
        </p>
      </div>
      <NoteForm endpoint={process.env.NEXT_PUBLIC_ENQUIRY_URL ?? ""} />
    </div>
  );
}
