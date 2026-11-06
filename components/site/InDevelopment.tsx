"use client";

import { Eyebrow, Panel } from "@/components/site/Blocks";
import { useHomeCopy } from "@/components/site/Remote";

export function InDevelopment() {
  const { inDevelopment } = useHomeCopy();
  return (
    <Panel>
      <div className="relative flex flex-col gap-5">
        <Eyebrow>In development</Eyebrow>
        <h2 id="dev" className="text-[clamp(72px,10vw,160px)] leading-[0.8] font-semibold tracking-[-0.07em]">
          {inDevelopment.name}
        </h2>
        <p className="max-w-[44ch] text-ink-muted">{inDevelopment.summary}</p>
      </div>
      <div aria-hidden className="relative grid grid-cols-2 gap-3 font-mono text-[13px]">
        <div className="rounded-[14px] bg-brand p-5 text-on-brand">GATEWAY</div>
        <div className="rounded-[14px] border border-line bg-paper-sunken p-5">SERVER</div>
        <div className="rounded-[14px] border border-line bg-paper-sunken p-5">
          DATABASE
          <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-line">
            <i className="block h-full w-[35%] rounded-pill bg-saffron" />
          </div>
          <span className="text-[11px] text-ink-muted">load 35%</span>
        </div>
        <div className="rounded-[14px] bg-saffron p-5 text-on-saffron">CACHE</div>
      </div>
    </Panel>
  );
}
