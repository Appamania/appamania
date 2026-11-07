"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { readToken } from "@/lib/firestore";
import { isAdmin } from "@/lib/schemas";

/** Email-link sign-in. Renders children with the id token once the admin is in. */
export function SignIn({
  project,
  apiKey,
  children,
}: {
  project: string;
  apiKey: string;
  children: (token: string, signOut: () => void) => React.ReactNode;
}) {
  const [phase, setPhase] = useState<"form" | "sent" | "ready" | "wrong" | "confirm" | "finishing">("form");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [oob, setOob] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function accept(idToken: string) {
    const claim = readToken(idToken);
    if (!claim || claim.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("admin-token");
      return;
    }
    if (!isAdmin(claim.email)) {
      sessionStorage.removeItem("admin-token");
      setPhase("wrong");
      return;
    }
    sessionStorage.setItem("admin-token", idToken);
    setToken(idToken);
    setPhase("ready");
  }

  async function finish(address: string, code: string) {
    setPhase("finishing");
    setPending(true);
    setError("");
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address, oobCode: code }),
        },
      );
      const data = (await res.json()) as { idToken?: string };
      if (!res.ok || !data.idToken) {
        setError("That link is no longer valid. Send a new one.");
        setPhase("form");
        return;
      }
      history.replaceState(null, "", "/admin");
      accept(data.idToken);
    } catch {
      setError("Could not finish sign-in. Send a new link.");
      setPhase("form");
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (!project || !apiKey) return;
    const params = new URLSearchParams(location.search);
    const code = params.get("oobCode");
    if (code && params.get("mode") === "signIn") {
      const saved = localStorage.getItem("admin-email") ?? "";
      if (!saved) {
        queueMicrotask(() => {
          setOob(code);
          setPhase("confirm");
        });
        return;
      }
      queueMicrotask(() => void finish(saved, code));
      return;
    }
    const savedToken = sessionStorage.getItem("admin-token");
    if (savedToken) queueMicrotask(() => accept(savedToken));
    // Sign-in runs once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, apiKey]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!isAdmin(address)) {
      setPhase("wrong");
      return;
    }
    setPending(true);
    setError("");
    try {
      localStorage.setItem("admin-email", address);
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "EMAIL_SIGNIN",
            email: address,
            continueUrl: `${location.origin}/admin`,
            canHandleCodeInApp: true,
          }),
        },
      );
      if (!res.ok) {
        setError("Could not send the link. Turn on email-link sign-in, then try again.");
        return;
      }
      setPhase("sent");
    } catch {
      setError("Could not send the link. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (!project || !apiKey) {
    return (
      <>
        <h1 className="text-h1">Admin</h1>
        <p className="mt-4 text-ink-muted">Add the Firebase project id and API key, then reload.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-h1">Admin</h1>
      {phase === "wrong" && (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p role="alert" className="text-ink-muted">
            This page is for the site owner.
          </p>
          <Button type="button" variant="outline" onClick={() => setPhase("form")}>
            Use a different email
          </Button>
        </div>
      )}
      {phase === "finishing" && (
        <p role="status" className="mt-6 text-ink-muted">
          Signing in.
        </p>
      )}
      {phase === "sent" && (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p className="text-ink-muted">Link sent. Open it in this browser.</p>
          <Button type="button" variant="outline" onClick={() => setPhase("form")}>
            Send another link
          </Button>
        </div>
      )}
      {(phase === "form" || phase === "confirm") && (
        <form
          noValidate
          className="mt-8 flex max-w-md flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (phase === "confirm") void finish(email, oob);
            else void send(event);
          }}
        >
          {error && (
            <p role="alert" className="text-small text-danger">
              {error}
            </p>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" loading={pending}>
            {phase === "confirm" ? "Finish sign-in" : "Send the link"}
          </Button>
        </form>
      )}
      {phase === "ready" &&
        children(token, () => {
          sessionStorage.removeItem("admin-token");
          setToken("");
          setPhase("form");
        })}
    </>
  );
}
