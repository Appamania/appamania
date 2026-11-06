"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { homeCopy } from "@/config/home";
import { decideRemote, fetchRemoteConfig, type HomeCopy } from "@/lib/store";

const HomeContext = createContext<HomeCopy>(homeCopy);

export function useHomeCopy() {
  return useContext(HomeContext);
}

export function Remote({ children }: { children: ReactNode }) {
  const [copy, setCopy] = useState(homeCopy);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!project || !key || !appId) return;
    const built = process.env.NEXT_PUBLIC_PAGE_VERSION ?? "1";
    let ignore = false;
    void fetchRemoteConfig(project, key, appId)
      .then((raw) => {
        if (ignore || !raw) return;
        const decision = decideRemote({ ...raw, built, reloadedFor: sessionStorage.getItem("rc-reloaded") });
        if (decision.reload && decision.mark) {
          sessionStorage.setItem("rc-reloaded", decision.mark);
          location.reload();
          return;
        }
        if (decision.copy) setCopy(decision.copy);
        setNotice(decision.notice);
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <HomeContext.Provider value={copy}>
      {notice && (
        <div role="status" className="wrap pt-4">
          <p className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-paper-raised px-4 py-3 text-small text-ink">
            {notice}
            <button type="button" className={buttonStyles("outline", "sm")} onClick={() => location.reload()}>
              Reload
            </button>
          </p>
        </div>
      )}
      {children}
    </HomeContext.Provider>
  );
}
