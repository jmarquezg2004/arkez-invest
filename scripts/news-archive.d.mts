type ArchiveStory = {
  title: string;
  href: string;
  date: string;
  source: string;
  image?: string;
  archived: true;
};
export const archivedHeadlines: readonly ArchiveStory[];
export const directoryArchive: readonly ArchiveStory[];
