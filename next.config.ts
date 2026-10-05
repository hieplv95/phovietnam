import type { NextConfig } from "next";

// Demo pages that shipped with the WordPress theme (English, New York
// address). They were still public and in the sitemap; send them home.
const THEME_DEMO_PAGES = [
  "about",
  "contact",
  "tea-drinks-menu",
  "afternoon-tea-menu",
  "desserts",
  "special-drinks-menu",
  "breakfast-brunch-menu",
  "shop",
  "shop-2",
  "my-account",
  "my-account-2",
];

const nextConfig: NextConfig = {
  // WordPress URLs end with "/"; keep them identical for SEO.
  trailingSlash: true,
  async redirects() {
    return [
      ...THEME_DEMO_PAGES.map((p) => ({ source: `/${p}/`, destination: "/", permanent: true })),
      // Yoast SEO sitemaps -> Next.js sitemap
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:name(page|post|category|post_tag|author|custom_blocks|custom_site_headers)-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/", destination: "/blog/", permanent: true },
      { source: "/category/:path*", destination: "/blog/", permanent: true },
      { source: "/tag/:path*", destination: "/blog/", permanent: true },
      { source: "/author/:path*", destination: "/blog/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
  },
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/wp-content/:path*", headers: longCache },
      { source: "/wp-includes/:path*", headers: longCache },
    ];
  },
};

export default nextConfig;
