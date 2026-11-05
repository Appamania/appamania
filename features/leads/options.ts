// Lead form options (PRD §18.2). Plain data, no zod: imported by the client form.
export const needs = [
  { value: "audit", label: "Audit" },
  { value: "sprint", label: "Sprint" },
  { value: "retainer", label: "Retainer" },
  { value: "mvp", label: "MVP" },
  { value: "website", label: "Website" },
  { value: "unsure", label: "Not sure" },
] as const;
