import { Section, Text } from "@react-email/components";
import { emailColors as c } from "@/styles/email";
import { Button, Frame, P } from "./Frame";

// Admin alert (PRD E2.3): every field, conflict flag, link to the pipeline.
export function LeadAlert({ rows, message, url }: { rows: [string, string | undefined][]; message?: string; url: string }) {
  return (
    <Frame preview="New lead">
      <Section>
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <Text key={k} style={{ margin: "0 0 4px", fontSize: 15 }}>
              <span style={{ color: c.muted }}>{k}: </span>
              {v}
            </Text>
          ))}
      </Section>
      {message && <P>{message}</P>}
      <Button href={url}>Open leads</Button>
    </Frame>
  );
}
