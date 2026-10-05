// Fixes for leftovers of the Patiotime theme demo that were still live on the
// WordPress site. Applied by import-wp.mjs to every imported page, so they
// survive a re-import.

const SITE = "https://phovietnam.es";
const MENU_PDF = "/menu-pho-vietnam-.pdf";
const MAPS_MARIA_CLARET =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("PHO VIETNAM, Carrer de Sant Antoni Maria Claret 230, 08025 Barcelona");
// Hero photo of the restaurant's dishes, used for link previews.
const SHARE_IMAGE = {
  url: `${SITE}/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-28-at-19.07.13-2.jpeg`,
  width: "1600",
  height: "1280",
  type: "image/jpeg",
};
// Demo images that ended up as link-preview images.
const DEMO_SHARE_IMAGES = /patiotime\.loftocean\.com|\/uploads\/2023\/06\/us\.png/;

// Google Consent Mode v2: Google tags stay in "denied" mode until the visitor
// accepts the matching category in the Complianz banner (which fires
// cmplz_fire_categories on load and on every change).
const CONSENT_MODE = `<script id="pv-consent-mode">
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500});
document.addEventListener('cmplz_fire_categories', function (e) {
  var c = (e.detail && e.detail.categories) || [];
  var ads = c.indexOf('marketing') > -1 ? 'granted' : 'denied';
  gtag('consent', 'update', {ad_storage: ads, ad_user_data: ads, ad_personalization: ads, analytics_storage: c.indexOf('statistics') > -1 ? 'granted' : 'denied'});
});
</script>`;

// Appended at the end of <body> so it wins over Elementor stylesheets that are
// linked inside the body (e.g. the header's post-232.css).
const STYLE_FIXES = `<style id="pv-fixes">
/* Header logo was 90px (80px on mobile/tablet) wide: too small to read. */
.elementor-232 .elementor-element.elementor-element-61a11a63 img { width: 180px; }
.elementor-232 .elementor-element.elementor-element-842cbf img { width: 150px; }
/* The header is transparent and overlaps a dark hero, but the blog index and
   404 page have no hero: white menu/icons on white, header over the content. */
body.blog #masthead, body.error404 #masthead { position: relative; background: #1a1a1a; }
body.blog #content { padding-top: 60px; }
/* "Más de 30 especialidades." is set at 5vw on desktop, so "ESPECIALIDADES."
   (~8em wide) overflowed its column and broke as "ESPECIALIDADE / S.". */
@media (min-width: 1025px) {
  .elementor-1036 .elementor-element.elementor-element-e6e1ea0 .pt-title { font-size: min(4.4vw, 72px); }
}
</style>`;

export function applyFixes($) {
  // Header "Find a Table" button pointed at the theme demo's reservation page.
  $('a[href*="patiotime.loftocean.com/demo11/reservation"]').each((_, a) => {
    $(a).attr("href", "/reserva-mesa/");
    $(a).find(".pt-btn-text").text("Reserva Mesa");
  });

  // Signature dish buttons (SET BANH CUON, GOI TOM, ...) pointed at demo menus.
  $('a[href*="patiotime.loftocean.com/demo11/"]').attr("href", MENU_PDF);

  // The Maria Claret address linked to the Barbican Centre in London.
  $('a[href*="Barbican"]').attr("href", MAPS_MARIA_CLARET).attr("target", "_blank").attr("rel", "noopener");

  // Home "Introducing Summer Special Fruit / Patio.Time Tea House" heading.
  $(".pt-subtitle")
    .filter((_, el) => /Patio\.Time/i.test($(el).text()))
    .each((_, el) => {
      const wrap = $(el).closest(".pt-title-wrap");
      $(el).text("Bienvenidos a PHO VIETNAM");
      wrap.find(".pt-title").html("Nuestros platos<br> especiales");
      // Script "Tea" lettering image placed over that heading.
      wrap.closest(".elementor-widget").nextAll(".elementor-widget-image").has('img[src*="/2023/06/tea"]').remove();
    });

  // Script "Us" lettering (from the demo's "About Us") over the home intro.
  $('img[src*="/2023/06/us.png"]').closest(".elementor-widget-image").remove();
  $("body").append(STYLE_FIXES);

  // Link previews (Facebook, WhatsApp...) used demo images.
  const og = $('meta[property="og:image"]');
  if (og.length && DEMO_SHARE_IMAGES.test(og.attr("content") || "")) {
    og.attr("content", SHARE_IMAGE.url);
    $('meta[property="og:image:width"]').attr("content", SHARE_IMAGE.width);
    $('meta[property="og:image:height"]').attr("content", SHARE_IMAGE.height);
    $('meta[property="og:image:type"]').attr("content", SHARE_IMAGE.type);
  }
  $('script[type="application/ld+json"]').each((_, el) => {
    const json = $(el).html() || "";
    if (!DEMO_SHARE_IMAGES.test(json)) return;
    const data = JSON.parse(json);
    for (const node of data["@graph"] || []) {
      if (node["@type"] === "ImageObject" && DEMO_SHARE_IMAGES.test(node.url || node.contentUrl || "")) {
        Object.assign(node, { url: SHARE_IMAGE.url, contentUrl: SHARE_IMAGE.url, width: +SHARE_IMAGE.width, height: +SHARE_IMAGE.height });
      }
      if (typeof node.thumbnailUrl === "string" && DEMO_SHARE_IMAGES.test(node.thumbnailUrl)) node.thumbnailUrl = SHARE_IMAGE.url;
    }
    $(el).text(JSON.stringify(data));
  });

  // Google Tag Manager / gtag ran before any cookie consent.
  $("head").prepend(CONSENT_MODE);
}
