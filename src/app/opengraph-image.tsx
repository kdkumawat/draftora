import { buildOgImageResponse } from "@/lib/og-image-response";

export const runtime = "edge";

export const alt =
  "Draftora - LinkedIn post editor with Unicode formatting and live feed preview";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return buildOgImageResponse();
}
