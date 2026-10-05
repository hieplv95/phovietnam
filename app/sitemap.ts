import type { MetadataRoute } from "next";
import { allPages, SITE_URL } from "@/lib/wp";

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages().map((p) => ({
    url: SITE_URL + p.path,
    lastModified: p.modified ?? undefined,
  }));
}
