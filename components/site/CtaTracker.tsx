"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// One delegated click listener for every data-cta link and mailto link.
export function CtaTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element).closest("a");
      if (a?.dataset.cta === "booking") {
        track("booking_click", { cta_location: location.pathname });
      } else if (a?.dataset.cta) {
        track("cta_click", { cta_id: a.dataset.cta, cta_location: location.pathname, offer: a.dataset.offer ?? "" });
      } else if (a?.href.startsWith("mailto:")) {
        track("email_click", { cta_location: location.pathname });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
