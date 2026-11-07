import type { Metadata } from "next";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { PageHero } from "@/components/site/Blocks";
import { NoteForm } from "@/components/site/NoteForm";
import { isOfferId } from "@/config/offers";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Start a project",
  description: `Book an audit or send a note to ${site.owner}. Reply within one working day, IST.`,
  alternates: { canonical: "/contact" },
};

export default async function Contact({ searchParams }: { searchParams: Promise<{ offer?: string }> }) {
  const { offer } = await searchParams;
  return (
    <div className="relative grid items-start gap-10 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <PageHero
        eyebrow="Contact"
        title="Start a"
        accent="project."
        lead="Pick an offer, say what the app does and what is wrong. I reply within one working day with next steps or a fixed quote."
      >
        {site.links.booking && (
          <a href={site.links.booking} className={buttonStyles("outline", "md", "self-start")}>
            Book a 20-minute call <Arrow />
          </a>
        )}
        <p className="font-mono text-small text-ink-muted">
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4 hover:text-brand">
            {site.email}
          </a>{" "}
          · {site.location}, IST · {site.billing}
        </p>
      </PageHero>
      <NoteForm
        project={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}
        apiKey={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ""}
        offer={offer && isOfferId(offer) ? offer : undefined}
      />
    </div>
  );
}
