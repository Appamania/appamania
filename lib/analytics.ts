export type AnalyticsEvent = "cta_click" | "booking_click" | "email_click" | "form_start" | "form_error" | "form_submit" | "generate_lead" | "form_fail";
declare global { interface Window { gtag?: (...args: unknown[]) => void } }
/** GA4 event via gtag. No-op when GA is not loaded (previews, local, blocked). */
export function track(name: AnalyticsEvent, params: Record<string, string | number> = {}) {
  if (typeof window !== "undefined") window.gtag?.("event", name, params);
}
