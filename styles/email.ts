// Email clients need literal colors; kept in styles/ so check:tokens stays strict elsewhere.
// Chai Studio light theme (PRD §7): emails read on white mail clients.
export const emailColors = {
  paper: "#F6F2EA",
  ink: "#16231C",
  muted: "#4A5A52",
  line: "#DDD4C4",
  brand: "#1F5C43",
  onBrand: "#F6F2EA",
  saffron: "#ECBC55",
} as const;
