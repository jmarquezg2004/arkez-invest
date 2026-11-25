const sources = [
  { name: "Investing España", feed: "https://es.investing.com/rss/news_285.rss", hosts: ["es.investing.com"] },
  { name: "Cointelegraph en Español", feed: "https://es.cointelegraph.com/rss", hosts: ["es.cointelegraph.com", "cointelegraph.com"] },
  { name: "Yahoo Finanzas", feed: "https://es.finance.yahoo.com/news/rss", hosts: ["es.finance.yahoo.com", "finance.yahoo.com"] },
];
export const newsImageHosts = ["content-media.investing.com", "images.cointelegraph.com", "s.yimg.com", "media.zenfs.com"];
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

  for (const candidate of [item.enclosure?.link, item.thumbnail, ...embedded]) {
    if (typeof candidate !== "string" || candidate.length > 1024) continue;
    const image = URL.parse(decodeHeadline(candidate));
    if (image?.protocol === "https:" && !image.username && !image.password && !image.port
        && newsImageHosts.includes(image.hostname) && /\.(?:jpe?g|png|webp|avif)$/i.test(image.pathname)) {
      image.hash = "";
      return image.href;
    }
  }
}

async function readFeed(source, load) {
  const url = new URL("https://api.rss2json.com/v1/api.json");
  url.searchParams.set("rss_url", source.feed);
  const response = await load(url, { signal: AbortSignal.timeout(5000), redirect: "error" });
  if (!response.ok || !response.body) return [];
  let size = 0;
  const decoder = new TextDecoder();
  let body = "";
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > maxBytes) return [];
    body += decoder.decode(chunk, { stream: true });
  }
  const data = JSON.parse(body + decoder.decode());
  if (data.status !== "ok" || !Array.isArray(data.items)) return [];
  return data.items.flatMap((item) => {
    if (typeof item?.title !== "string" || typeof item.link !== "string" || typeof item.pubDate !== "string") return [];
    const title = decodeHeadline(item.title);
    if (!title || title.length > 240 || /[<>]/.test(title) || !/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(item.pubDate)) return [];
    const href = URL.parse(item.link);
    const date = Date.parse(item.pubDate.replace(" ", "T") + "Z");
    if (!href || href.protocol !== "https:" || href.username || href.password || href.port ||
        !source.hosts.includes(href.hostname) || !Number.isFinite(date)) return [];
    href.search = "";
    href.hash = "";
    const media = headlineImage(item);
    return [{ title, href: href.href, date: new Date(date).toISOString(), source: source.name, ...(media ? { image: media } : {}) }];
  }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
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
