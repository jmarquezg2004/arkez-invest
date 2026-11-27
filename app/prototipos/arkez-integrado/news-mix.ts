export const directorySources = [
  { source: "Yahoo Finanzas", slots: 2, href: "https://finance.yahoo.com/" },
  { source: "The Wall Street Journal", slots: 2, href: "https://www.wsj.com/finance" },
  { source: "Investing España", slots: 1, href: "https://es.investing.com/news/" },
  { source: "Cointelegraph", slots: 1, href: "https://cointelegraph.com/category/latest-news" },
] as const;

export function directoryGroups<T extends { source: string; href: string }>(live: readonly T[], archive: readonly T[]) {
  return directorySources.map(({ source, slots }) => {
    const recent = live.filter((story) => story.source === source);
    const stories = recent.length > slots ? recent : [...recent, ...archive.filter((story) =>
      story.source === source && !recent.some(({ href }) => href === story.href))];
    return { slots, stories };
  });
}

export function directoryBatch<T>(groups: readonly { slots: number; stories: readonly T[] }[], batch: number) {
  return groups.flatMap(({ slots, stories }) => {
    if (stories.length <= slots) return stories;
    // Move even when a feed has just one extra story, while keeping each batch distinct.
    const offset = batch * (stories.length % slots === 0 ? slots : 1);
    return Array.from({ length: slots }, (_, index) => stories[(offset + index) % stories.length]);
  });
}
