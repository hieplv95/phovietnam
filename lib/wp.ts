import { pages, notFound } from "@/content/registry";

export const SITE_URL = "https://phovietnam.es";

export type WpPage = {
  path: string;
  title: string;
  modified: string | null;
  // Complete HTML document as WordPress rendered it, cleaned up and with
  // asset URLs pointing at /public (see scripts/import-wp.mjs).
  html: string;
};

const byPath: Record<string, WpPage> = pages;

export function slugToPath(slug: string[] | undefined): string {
  return slug && slug.length ? `/${slug.join("/")}/` : "/";
}

export function getPage(path: string): WpPage | undefined {
  return byPath[path];
}

export function allPages(): WpPage[] {
  return Object.values(byPath);
}

export const notFoundPage: WpPage = notFound;
