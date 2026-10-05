import { allPages, getPage, notFoundPage, slugToPath } from "@/lib/wp";

// Pages are served as the exact HTML documents WordPress produced, so the
// theme's jQuery/Elementor scripts own the DOM — no React hydration to fight
// with. Every known page is prerendered at build time.
export const dynamic = "force-static";

export function generateStaticParams() {
  return allPages().map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
}

export async function GET(_req: Request, ctx: RouteContext<"/[[...slug]]">) {
  const { slug } = await ctx.params;
  const page = getPage(slugToPath(slug));
  return new Response((page ?? notFoundPage).html, {
    status: page ? 200 : 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
