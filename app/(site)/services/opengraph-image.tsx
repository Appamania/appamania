import { formatPrice, offers } from "@/config/offers";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Appamania services and fixed prices";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    eyebrow: "Services",
    title: `Audit ${formatPrice(offers.audit)} · Sprint ${formatPrice(offers.sprint)} · Retainer ${formatPrice(offers.retainer)}`,
  });
}
