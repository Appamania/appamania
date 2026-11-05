import { Body, Container, Head, Html, Link, Preview, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { emailColors as c } from "@/styles/email";

// Shared email frame (PRD §17): 600px single column, system fonts, brand colour on the button only.
const font = "system-ui,-apple-system,'Segoe UI',sans-serif";

export function Frame({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en-IN">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: 24, background: c.paper, fontFamily: font, color: c.ink }}>
        <Container style={{ maxWidth: 600 }}>
          <Text style={{ fontWeight: 600, fontSize: 20, letterSpacing: "-0.03em", margin: "0 0 24px" }}>appamania</Text>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

export const P = ({ children }: { children: ReactNode }) => (
  <Text style={{ fontSize: 16, lineHeight: "26px", margin: "0 0 16px" }}>{children}</Text>
);

export const Muted = ({ children }: { children: ReactNode }) => (
  <Text style={{ fontSize: 14, lineHeight: "22px", color: c.muted, margin: "24px 0 0" }}>{children}</Text>
);

export const Button = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    style={{ display: "inline-block", background: c.brand, color: c.onBrand, padding: "12px 22px", borderRadius: 999, textDecoration: "none", fontWeight: 500, margin: "8px 0 16px" }}
  >
    {children}
  </Link>
);
