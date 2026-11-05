import type { Metadata } from "next";
import { Arrow, buttonStyles } from "@/components/ui/Button";
import { Chip } from "@/components/site/Blocks";
import { priceText } from "@/components/site/Price";
import { site } from "@/config/site";
import { ContactForm } from "@/features/leads/components/ContactForm";

export const metadata: Metadata = {
  title: "Book an audit or enquire",
  description: `Book a ${priceText("audit")} Flutter app audit or send a project enquiry. Replies within one working day.`,
  alternates: { canonical: "/contact" },
};

// Contact (canvas board Contact, PRD E1.6). Buttons appear only when their link is configured: no dead ends.
export default function Contact() {
  const auditPage = process.env.NEXT_PUBLIC_AUDIT_PAGE_URL;
  const links = [
    auditPage && { href: auditPage, label: `Pay ${priceText("audit")} and book audit`, primary: true },
    site.callUrl && { href: site.callUrl, label: "Book a 20-minute call" },
    site.whatsapp && { href: `https://wa.me/${site.whatsapp}`, label: "Message on WhatsApp" },
  ].filter(Boolean) as { href: string; label: string; primary?: boolean }[];
  const needLabels = { audit: `Audit · ${priceText("audit")}`, sprint: `Sprint · ${priceText("sprint")}` };

  return (
    <div className="relative grid items-start gap-10 pt-14 pb-6 min-[900px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] min-[900px]:pt-22">
      <div className="relative flex flex-col gap-6">
        <Chip dot className="self-start">Replies within one working day</Chip>
        <h1 className="text-[clamp(52px,7vw,104px)] leading-[0.92] font-semibold tracking-[-0.055em]">
          Tell me about <span className="text-brand">the app.</span>
        </h1>
        <p className="max-w-[46ch] text-body-lg text-ink-muted">
          If it&apos;s a fit, you get a payment link for the audit and a repo-access checklist. NDA on request.
        </p>
        {links.length > 0 && (
          <div className="flex max-w-[420px] flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={buttonStyles("outline", "md", "justify-between")}>
                {l.label} <Arrow />
              </a>
            ))}
          </div>
        )}
        <p className="font-mono text-[13px] text-ink-muted">
          <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4 hover:text-brand">{site.email}</a> · Kolkata, IST (UTC+5:30) · remote worldwide
          <br />
          Razorpay: UPI, cards or netbanking
        </p>
      </div>
      <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} needLabels={needLabels} />
    </div>
  );
}
