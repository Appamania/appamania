/** Portal, admin, and `/portal/login`. Off for marketing-only deploys. Local `make up` sets true. */
export function portalEnabled() {
  return process.env.NEXT_PUBLIC_PORTAL_ENABLED === "true";
}
