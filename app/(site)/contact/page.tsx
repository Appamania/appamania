import { Suspense } from "react";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Eyebrow, PageHero } from "@/components/site/Blocks";
import { NoteForm } from "@/components/site/NoteForm";
import { site } from "@/config/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Book a Flutter app audit",
  description: `Send the app or repo and what is wrong. ${site.owner} replies within one working day, IST, with next steps or a fixed quote. Or book a 20-minute call.`,
  path: "/contact",
  rootImage: true,
});

export default function Contact() {
  const details = [`${site.location}, IST`, site.billing].filter(Boolean).join(" · ");
  return (
    <div className="relative grid items-start gap-10 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <PageHero
        eyebrow="Contact"
        title="Start with"
        accent="the audit."
        lead={`Say what the app does and what is wrong. ${site.owner} replies within one working day, IST, with next steps or a fixed quote.`}
      >
        {site.links.booking && (
          <a href={site.links.booking} data-cta="booking" className={buttonStyles("outline", "md", "self-start")}>
            Book a 20-minute call <Arrow />
          </a>
        )}
        <p className="font-mono text-small text-ink-muted">
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4 hover:text-brand">
            {site.email}
          </a>
          {details && ` · ${details}`}
        </p>
        <div className="flex flex-col gap-3">
          <Eyebrow>What happens next</Eyebrow>
          <ol className="flex list-decimal flex-col gap-2 pl-5 font-mono text-small text-ink-muted">
            <li>{`${site.owner} reads the note and the app or repo.`}</li>
            <li>You get a reply in one working day: a question, a quote, or next steps.</li>
            <li>The audit report comes in 48 hours.</li>
          </ol>
        </div>
      </PageHero>
      <Suspense
        fallback={<div aria-hidden className="min-h-[40rem] rounded-lg border border-line bg-paper-raised p-6 sm:p-9" />}
      >
        <NoteForm
          project={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}
          apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ""}
        />
      </Suspense>
    </div>
  );
}
