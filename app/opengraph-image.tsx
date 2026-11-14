import { site } from "@/config/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${site.name}: ${site.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return ogImage({ eyebrow: site.descriptor, title: "Stuck Flutter app? Fixed price, shipped." });
}
