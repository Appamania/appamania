import type { Metadata } from "next";
import { Chip, Eyebrow, PageHero, Panel, Section } from "@/components/site/Blocks";
import { apps, inDevelopment } from "@/config/catalog";

export const metadata: Metadata = {
  title: "Apps",
  description: "Small Flutter apps on Google Play, built and shipped by Appamania.",
  alternates: { canonical: "/apps" },
};

// Apps (canvas board Apps, PRD E1.5).
export default function Apps() {
  return (
    <>
      <PageHero
        eyebrow="Apps"
        title="Products I build and"
        accent="ship myself."
        lead="Small Flutter apps on Google Play, built and shipped from Kolkata."
      />
      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[900px]:grid-cols-4">
        {apps.map((a) => (
          <li key={a.name} className="flex flex-col gap-4 rounded-lg border border-line bg-paper-raised p-5">
            {/* TODO(content): real screenshot via Cloudinary per app. */}
            <div aria-hidden className="grid aspect-[4/5] place-items-center rounded-md border border-line bg-paper-sunken">
              <span className="grid size-22 place-items-center rounded-[24px] border border-line-strong bg-paper-raised text-[34px] font-semibold">{a.initial}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>{a.category}</Eyebrow>
              <Chip className="h-6.5 text-[12px]">{a.badge}</Chip>
            </div>
            <h2 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.03em]">{a.name}</h2>
            <p className="text-ink-muted">{a.summary}</p>
            <a href={a.url} className="mt-auto font-mono text-[13px] text-brand underline-offset-4 hover:underline">
              Get it on Google Play<span className="sr-only"> ({a.name})</span>
            </a>
          </li>
        ))}
      </ul>
      <Section aria-labelledby="dev">
        <Panel>
          <div className="relative flex flex-col gap-5">
            <Eyebrow>In development</Eyebrow>
            <h2 id="dev" className="text-[clamp(72px,10vw,160px)] leading-[0.8] font-semibold tracking-[-0.07em]">{inDevelopment.name}</h2>
            <p className="max-w-[44ch] text-ink-muted">{inDevelopment.summary}</p>
          </div>
          <div aria-hidden className="relative grid grid-cols-2 gap-3 font-mono text-[13px]">
            <div className="rounded-[14px] bg-brand p-5 text-on-brand">GATEWAY</div>
            <div className="rounded-[14px] border border-line bg-paper-sunken p-5">SERVER</div>
            <div className="rounded-[14px] border border-line bg-paper-sunken p-5">
              DATABASE
              <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-line"><i className="block h-full w-[35%] rounded-pill bg-saffron" /></div>
              <span className="text-[11px] text-ink-muted">load 35%</span>
            </div>
            <div className="rounded-[14px] bg-saffron p-5 text-on-saffron">CACHE</div>
          </div>
        </Panel>
      </Section>
    </>
  );
}
