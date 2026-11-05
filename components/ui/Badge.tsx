import {
  Ban,
  Calendar,
  Check,
  CheckCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Clock,
  Filter,
  Inbox,
  Mail,
  Pause,
  Play,
  Send,
  Trophy,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { cx } from "@/lib/cx";

// PRD §8 status mapping. Label + icon always; colour never alone.
export type Tone = "brand" | "saffron" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-tint text-brand",
  saffron: "bg-saffron-tint text-ink",
  danger: "border border-danger text-danger",
  neutral: "bg-paper-sunken text-ink-muted",
};

export function Badge({ tone = "neutral", icon: Icon, children, className }: {
  tone?: Tone;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 font-mono text-label whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon aria-hidden className="size-3.5" />}
      {children}
    </span>
  );
}

type Status = { label: string; tone: Tone; icon: LucideIcon };

export const statuses = {
  project: {
    booked: { label: "Booked", tone: "neutral", icon: Calendar },
    active: { label: "Active", tone: "brand", icon: Play },
    on_hold: { label: "On hold", tone: "saffron", icon: Pause },
    done: { label: "Done", tone: "brand", icon: Check },
    cancelled: { label: "Cancelled", tone: "neutral", icon: Ban },
  },
  milestone: {
    todo: { label: "To do", tone: "neutral", icon: CircleDashed },
    active: { label: "In progress", tone: "saffron", icon: CircleDot },
    done: { label: "Done", tone: "brand", icon: Check },
  },
  invoice: {
    draft: { label: "Draft", tone: "neutral", icon: CircleDashed },
    sent: { label: "Sent", tone: "neutral", icon: Send },
    partially_paid: { label: "Partly paid", tone: "saffron", icon: CircleDotDashed },
    paid: { label: "Paid", tone: "brand", icon: CheckCheck },
    void: { label: "Void", tone: "neutral", icon: Ban },
    overdue: { label: "Overdue", tone: "danger", icon: TriangleAlert },
  },
  changeRequest: {
    open: { label: "Open", tone: "neutral", icon: Inbox },
    quoted: { label: "Quoted", tone: "saffron", icon: Clock },
    approved: { label: "Approved", tone: "brand", icon: Check },
    declined: { label: "Declined", tone: "neutral", icon: X },
    done: { label: "Done", tone: "brand", icon: CheckCheck },
  },
  lead: {
    new: { label: "New", tone: "saffron", icon: Inbox },
    contacted: { label: "Contacted", tone: "neutral", icon: Mail },
    call_booked: { label: "Call booked", tone: "neutral", icon: Calendar },
    proposal_sent: { label: "Proposal sent", tone: "neutral", icon: Send },
    won: { label: "Won", tone: "brand", icon: Trophy },
    lost: { label: "Lost", tone: "neutral", icon: X },
    declined_auto: { label: "Auto-declined", tone: "neutral", icon: Filter },
  },
} as const satisfies Record<string, Record<string, Status>>;

export function StatusPill<D extends keyof typeof statuses>({ domain, value }: {
  domain: D;
  value: keyof (typeof statuses)[D];
}) {
  const s = statuses[domain][value] as Status;
  return (
    <Badge tone={s.tone} icon={s.icon}>
      {s.label}
    </Badge>
  );
}
