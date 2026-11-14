import { site } from "@/config/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `About Appamania, ${site.owner}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "About", title: `Appamania is run by ${site.owner}.` });
}
