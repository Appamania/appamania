import { Link } from "@react-email/components";
import { site } from "@/config/site";
import { Button, Frame, Muted, P } from "./Frame";

// Lead acknowledgement (PRD E2.2, §17): first person from Sumit. Conflict variant has no call link.
export function LeadAck({ name, conflict, siteUrl }: { name: string; conflict: boolean; siteUrl: string }) {
  const first = name.split(" ")[0];
  if (conflict)
    return (
      <Frame preview="Thanks for reaching out">
        <P>Hi {first},</P>
        <P>Thanks for reaching out. I&apos;m not able to take on work in this industry right now.</P>
        <P>I appreciate you thinking of Appamania.</P>
        <Muted>Sumit, Appamania</Muted>
      </Frame>
    );
  return (
    <Frame preview="Got your message — reply within one working day">
      <P>Hi {first},</P>
      <P>Thanks for the details. I&apos;ll reply within {site.responseSlaBusinessDays} working day with next steps.</P>
      <P>If it&apos;s a fit, you get a payment link for the audit and a repo-access checklist. NDA on request.</P>
      {site.callUrl ? (
        <Button href={site.callUrl}>Book a 20-minute call</Button>
      ) : (
        <P>If a call helps, reply with two times that suit you.</P>
      )}
      <P>
        Offers and prices: <Link href={`${siteUrl}/services`}>{`${siteUrl}/services`}</Link>
      </P>
      <Muted>Sumit, Appamania</Muted>
    </Frame>
  );
}
