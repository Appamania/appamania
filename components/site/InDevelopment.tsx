import { Eyebrow, Panel } from "@/components/site/Blocks";
import { inDevelopment } from "@/config/catalog";

export function InDevelopment() {
  return (
    <Panel>
      <div className="relative flex flex-col gap-5">
        <Eyebrow>In development</Eyebrow>
        <h2 id="dev" className="text-[clamp(72px,10vw,160px)] leading-[0.8] font-semibold tracking-[-0.07em]">
          {inDevelopment.name}
        </h2>
        <p className="max-w-[44ch] text-ink-muted">{inDevelopment.summary}</p>
      </div>
      <div aria-hidden className="relative grid grid-cols-2 gap-3 font-mono text-small">
        <div className="rounded-[14px] bg-brand p-5 text-on-brand">Gateway</div>
        <div className="rounded-[14px] border border-line bg-paper-sunken p-5">Server</div>
        <div className="rounded-[14px] border border-line bg-paper-sunken p-5">Database</div>
        <div className="rounded-[14px] bg-saffron p-5 text-on-saffron">Cache</div>
      </div>
    </Panel>
  );
}
