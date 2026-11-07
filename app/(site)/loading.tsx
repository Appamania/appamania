// Skeleton matching PageHero: eyebrow, two heading lines, one lead line.
export default function Loading() {
  return (
    <div role="status" aria-busy aria-label="Loading" className="flex max-w-[980px] flex-col gap-6 pt-14 min-[900px]:pt-24">
      <div className="h-4 w-24 rounded-pill bg-paper-raised" />
      <div className="h-[clamp(52px,7.4vw,112px)] w-4/5 rounded-md bg-paper-raised" />
      <div className="h-[clamp(52px,7.4vw,112px)] w-3/5 rounded-md bg-paper-raised" />
      <div className="h-7 w-2/3 rounded-md bg-paper-raised" />
    </div>
  );
}
