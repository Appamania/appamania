// Lead qualification (PRD §2.1, §18.1). Pure so it is unit-tested.
export function qualify(industry: string, conflictIndustries: readonly string[]) {
  const conflict = conflictIndustries.includes(industry);
  return { conflict, stage: conflict ? ("declined_auto" as const) : ("new" as const) };
}

/** Rate limits (PRD E2.1). */
export const LIMITS = { perIpPerHour: 5, perEmailMinutes: 10 } as const;
