// The Complianz cookie banner script (kept as-is from WordPress) pings its
// REST API for optional features (consent logging, document areas). None are
// enabled on this site, so answer with an empty success.
export function GET() {
  return Response.json({});
}

export function POST() {
  return Response.json({});
}
