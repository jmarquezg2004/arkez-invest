type Story = { title: string; href: string; date: string; source: string; image?: string };
export function createPreviewNews(): () => Promise<Story[]>;
