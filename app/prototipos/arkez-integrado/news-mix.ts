export const directorySources = [
  { source: "Yahoo Finanzas", href: "https://finance.yahoo.com/" },
  { source: "The Wall Street Journal", href: "https://www.wsj.com/finance" },
  { source: "Investing.com", href: "https://www.investing.com/news/" },
  { source: "Investing España", href: "https://es.investing.com/news/" },
  { source: "Cointelegraph", href: "https://cointelegraph.com/category/latest-news" },
  { source: "CNBC", href: "https://www.cnbc.com/markets/" },
  { source: "The Motley Fool", href: "https://www.fool.com/trending-news/" },
  { source: "CoinGecko", href: "https://www.coingecko.com/research/latest" },
  { source: "CoinMarketCap", href: "https://coinmarketcap.com/academy" },
] as const;

export function directoryGroups<T extends { source: string; href: string }>(
  live: readonly T[], archive: readonly T[], hasPhoto: (story: T) => boolean, locale: "en" | "es" = "es",
) {
  const unique = new Map(live.map((story) => [story.href, story]));
  for (const story of archive) if (!unique.has(story.href) || (hasPhoto(story) && !hasPhoto(unique.get(story.href)!))) unique.set(story.href, story);
  const forSource = (source: string) => Array.from(unique.values()).filter((story) => story.source === source);
  const withPhotos = (source: string) => forSource(source).filter(hasPhoto);
  const existingGroup = (source: string, slots: number) => {
    const recent = live.filter((story) => story.source === source);
    return { slots, stories: recent.length > slots ? recent : forSource(source) };
  };
  const yahoo = withPhotos("Yahoo Finanzas");
  const cnbc = withPhotos("CNBC");
  const fool = withPhotos("The Motley Fool");
  const market = yahoo.length >= 2 ? [{ slots: 2, stories: yahoo }]
    : cnbc.length && fool.length ? [{ slots: 1, stories: cnbc }, { slots: 1, stories: fool }]
      : [{ slots: 2, stories: [...cnbc, ...fool, ...yahoo] }];
  if (market.length === 1 && market[0].stories.length < 2) {
    const selected = new Set(market[0].stories.map(({ href }) => href));
    const backup = ["CNBC", "The Motley Fool", "Yahoo Finanzas"].flatMap(forSource)
      .filter(({ href }) => !selected.has(href));
    market[0].stories = [...market[0].stories, ...backup.slice(0, 2 - market[0].stories.length)];
  }
  const cryptoSources = ["Cointelegraph", "CoinGecko", "CoinMarketCap"];
  const crypto = cryptoSources.map(withPhotos).find((stories) => stories.length)
    ?? cryptoSources.map(forSource).find((stories) => stories.length) ?? [];
  return [...market, existingGroup("The Wall Street Journal", 2), existingGroup(locale === "en" ? "Investing.com" : "Investing España", 1),
    { slots: 1, stories: crypto }];
}

export function directoryBatch<T>(groups: readonly { slots: number; stories: readonly T[] }[], batch: number) {
  return groups.flatMap(({ slots, stories }) => {
    if (stories.length <= slots) return stories;
    // Move even when a feed has just one extra story, while keeping each batch distinct.
    const offset = batch * (stories.length % slots === 0 ? slots : 1);
    return Array.from({ length: slots }, (_, index) => stories[(offset + index) % stories.length]);
  });
}


export function newsLanguage(href: string) {
  return new URL(href).hostname.startsWith("es.") ? "es" : "en";
}
