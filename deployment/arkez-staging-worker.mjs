// The staging packager provides the CSP map and the shared news loader above this module.
const integratedHome = "/prototipos/arkez-integrado/";
const getHeadlines = createPreviewNews({ enrich: true, archive: directoryArchive });
const getNewsPhoto = createNewsPhoto(getHeadlines, fetch, [...archivedHeadlines, ...directoryArchive]);
const getMarket = createMarketLookup();
const getCompanyStory = createCompanyStoryHandler({ lookup: getMarket });
const askIsa = createIsaHandler();
const stagingHeaders = {
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === companyStoryRoot) return getCompanyStory(request, env, ctx);
    if (url.pathname === isaRoot) return askIsa(request, env);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405, headers: { ...stagingHeaders, Allow: "GET, HEAD" } });
    }
    if (url.pathname === marketRoot) {
      const result = await getMarket(url);
      const headers = new Headers(result.headers);
      for (const [name, value] of Object.entries(stagingHeaders)) headers.set(name, value);
      return new Response(request.method === "HEAD" ? null : result.body, { status: result.status, headers });
    }
    if (url.pathname === "/api/noticias/imagen") {
      const photo = await getNewsPhoto(url, request.method);
      const headers = new Headers(photo.headers);
      for (const [name, value] of Object.entries(stagingHeaders)) headers.set(name, value);
      return new Response(photo.body, { status: photo.status, headers });
    }
    if (url.pathname === "/api/noticias/preview") {
      const headers = { ...stagingHeaders, "Cache-Control": "public, max-age=60" };
      return request.method === "HEAD"
        ? new Response(null, { headers: { ...headers, "Content-Type": "application/json" } })
        : Response.json(await getHeadlines(), { headers });
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(null, {
        status: 302,
        headers: { ...stagingHeaders, Location: integratedHome + url.search, "Cache-Control": "no-store" },
      });
    }
    const asset = await env.ASSETS.fetch(request);
    const headers = new Headers(asset.headers);
    for (const [name, value] of Object.entries(stagingHeaders)) headers.set(name, value);
    if (headers.get("Content-Type")?.startsWith("text/html")) {
      const path = url.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
      const policy = asset.status === 404 ? stagingPolicies["/404.html"] : stagingPolicies[path] ?? stagingPolicies[url.pathname];
      headers.set("Content-Security-Policy", policy ?? stagingPolicies["/404.html"]);
      headers.set("Cache-Control", "no-store");
    }
    return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });
  },
};
