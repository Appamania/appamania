"use client";

import { useEffect } from "react";
import { firebaseApp } from "@/lib/firebase";

export function Analytics() {
  useEffect(() => {
    const app = firebaseApp();
    if (!app) return;
    let remove = () => {};
    void import("firebase/analytics").then(async ({ getAnalytics, isSupported, logEvent }) => {
      if (!(await isSupported())) return;
      const analytics = getAnalytics(app);
      const onError = (event: ErrorEvent) => {
        logEvent(analytics, "exception", { description: event.message, fatal: false });
      };
      window.addEventListener("error", onError);
      remove = () => window.removeEventListener("error", onError);
    });
    return () => remove();
  }, []);
  return null;
}
