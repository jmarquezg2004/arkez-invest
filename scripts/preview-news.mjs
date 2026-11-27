const sources = [
  { name: "Reserva Federal", feed: "https://www.federalreserve.gov/feeds/press_monetary.xml", hosts: ["www.federalreserve.gov"], limit: 3 },
  { name: "Investing España", feed: "https://es.investing.com/rss/news_285.rss", hosts: ["es.investing.com"] },
  { name: "Investing España", feed: "https://es.investing.com/rss/news.rss", hosts: ["es.investing.com"] },
  { name: "Cointelegraph", feed: "https://es.cointelegraph.com/rss", hosts: ["es.cointelegraph.com", "cointelegraph.com"] },
  { name: "Cointelegraph", feed: "https://cointelegraph.com/rss", hosts: ["cointelegraph.com"] },
  { name: "Yahoo Finanzas", feed: "https://es.finance.yahoo.com/news/rss", hosts: ["es.finance.yahoo.com", "finance.yahoo.com"] },
  { name: "Yahoo Finanzas", feed: "https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC,%5EDJI,%5EIXIC&region=US&lang=en-US", hosts: ["finance.yahoo.com", "es.finance.yahoo.com"] },
  { name: "The Wall Street Journal", feed: "https://feeds.content.dowjones.io/public/rss/RSSMarketsMain", hosts: ["www.wsj.com", "wsj.com"] },
];
export const newsImageHosts = ["content-media.investing.com", "images.cointelegraph.com", "s.yimg.com", "media.zenfs.com", "images.wsj.net"];
const maxBytes = 1_000_000;

const namedEntities = { amp: "&", quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">", ndash: "–", mdash: "—", hellip: "…" };

function decodeHeadline(title) {
  return title.replace(/&(#x[0-9a-f]{1,6}|#\d{1,7}|[a-z]+);/gi, (entity, key) => {
    if (!key.startsWith("#")) return Object.hasOwn(namedEntities, key) ? namedEntities[key] : entity;
    const hex = key[1].toLowerCase() === "x";
    const code = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
    return code >= 32 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : entity;
  }).trim();
}

function headlineImage(item) {
  const markup = typeof item.description === "string" ? item.description.slice(0, 12_000) : "";
  const embedded = Array.from(markup.matchAll(/<img\b[^<>]*?\ssrc\s*=\s*(?:"([^"]+)"|'([^']+)')/gi),
    ([, doubleQuoted, singleQuoted]) => doubleQuoted ?? singleQuoted);

  for (const candidate of [item.enclosure?.link, ...embedded, item.thumbnail]) {
    if (typeof candidate !== "string" || candidate.length > 1024) continue;
    const image = URL.parse(decodeHeadline(candidate));
    if (image?.protocol === "https:" && !image.username && !image.password && !image.port
        && newsImageHosts.includes(image.hostname) && (/\.(?:jpe?g|png|webp|avif)$/i.test(image.pathname)
          || (image.hostname === "images.wsj.net" && /^\/im-\d+$/.test(image.pathname)))) {
      image.hash = "";
      return image.href;
    }
  }
}

async function feedBody(url, load) {
  const response = await load(url, { signal: AbortSignal.timeout(5000), redirect: "error" });
  if (!response.ok || !response.body) return [];
  let size = 0;
  const decoder = new TextDecoder();
  let body = "";
  const reader = response.body.getReader();
  for (;;) {
    const { done, value: chunk } = await reader.read();
    if (done) break;
    size += chunk.byteLength;
    if (size > maxBytes) { await reader.cancel(); return []; }
    body += decoder.decode(chunk, { stream: true });
  }
  return body + decoder.decode();
}

function rssItems(xml) {
  if (typeof xml !== "string") return [];
  return Array.from(xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item\s*>/gi), ([, item]) => {
    const field = (tag) => (item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}\\s*>`, "i"))?.[1] ?? "")
      .trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1").trim();
    const date = Date.parse(field("pubDate"));
    const media = /<(?:enclosure|media:content|media:thumbnail)\b[^<>]*?\surl\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(item);
    return { title: field("title"), link: decodeHeadline(field("link")), description: field("description"),
      pubDate: Number.isFinite(date) ? new Date(date).toISOString().slice(0, 19).replace("T", " ") : "",
      enclosure: media ? { link: media[1] ?? media[2] } : undefined };
  });
}

async function readFeed(source, load) {
  const url = new URL("https://api.rss2json.com/v1/api.json");
  url.searchParams.set("rss_url", source.feed);
  const data = await feedBody(url, load).then((body) => JSON.parse(body)).catch(() => null);
  const useDirect = ["Cointelegraph", "Yahoo Finanzas"].includes(source.name);
  const items = data?.status === "ok" && Array.isArray(data.items) && data.items.length
    ? data.items : useDirect ? rssItems(await feedBody(new URL(source.feed), load).catch(() => null)) : [];
  return items.slice(0, source.limit ?? 10).flatMap((item) => {
    if (typeof item?.title !== "string" || typeof item.link !== "string" || typeof item.pubDate !== "string") return [];
    const title = decodeHeadline(item.title);
    if (!title || title.length > 240 || /[<>]/.test(title) || !/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(item.pubDate)) return [];
    if (source.name === "Investing España" && /hazte con|descuento|disparan esta semana en el black friday|posiciónate ahora/i.test(title)) return [];
    const href = URL.parse(item.link);
    const date = Date.parse(item.pubDate.replace(" ", "T") + "Z");
    if (!href || href.protocol !== "https:" || href.username || href.password || href.port ||
        !source.hosts.includes(href.hostname) || !Number.isFinite(date)) return [];
    href.search = "";
    href.hash = "";
    const media = headlineImage(item);
    return [{ title, href: href.href, date: new Date(date).toISOString(), source: source.name, ...(media ? { image: media } : {}) }];
  });
}

export function createPreviewNews({ load = fetch, now = Date.now } = {}) {
  let expires = 0;
  let request;
  return () => {
    if (request && now() < expires) return request;
    expires = now() + 5 * 60_000;
    request = Promise.allSettled(sources.map((source) => readFeed(source, load))).then((results) => {
      const seen = new Set();
      return results.flatMap((result) => result.status === "fulfilled" ? result.value : [])
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter(({ href }) => {
          if (seen.has(href)) return false;
          seen.add(href);
          return true;
        });
    });
    return request;
  };
}


export function createNewsPhoto(getNews, load = fetch, archive = []) {
  return async (url, method) => {
    const link = url.searchParams.get("url");
    const reject = (status) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });
    if (!link || link.length > 1024 || !newsImageHosts.includes(URL.parse(link)?.hostname)) return reject(404);
    // Only relay an original image attached to a story currently returned by the curated feeds.
    if (!archive.some((story) => story.image === link) && !(await getNews()).some((story) => story.image === link)) return reject(404);
    try {
      const upstream = await load(link, { redirect: "error", signal: AbortSignal.timeout(4500) });
      const type = upstream.headers.get("content-type")?.split(";")[0];
      if (!upstream.ok || !upstream.body || !/^image\/(jpeg|png|webp|avif)$/.test(type ?? "")) return reject(502);
      const reader = upstream.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 2_000_000) { await reader.cancel(); return reject(502); }
        chunks.push(value);
      }
      return new Response(method === "HEAD" ? null : new Blob(chunks), {
        headers: { "Content-Type": type, "Content-Length": String(size), "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" },
      });
    } catch {
      return reject(502);
    }
  };
}
