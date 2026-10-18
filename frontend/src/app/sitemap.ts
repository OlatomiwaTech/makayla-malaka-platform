import type { MetadataRoute } from 'next';

import { canonicalUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type SitemapItem = {
  id: string;
  updatedAt: string;
};

type CatalogResponse = {
  success: boolean;
  data: {
    releases?: SitemapItem[];
    videos?: SitemapItem[];
    pagination: {
      totalPages: number;
      hasNextPage: boolean;
    };
  };
};

const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL ??
    (process.env.NODE_ENV === 'production'
      ? ''
      : 'http://localhost:5000/api')
).replace(/\/+$/, '');

const getCatalogEntries = async (
  path: '/music' | '/videos',
  key: 'releases' | 'videos',
): Promise<MetadataRoute.Sitemap> => {
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL must be configured to include published catalogues in the sitemap.');
  }

  const entries: MetadataRoute.Sitemap = [];
  let page = 1;

  do {
    const response = await fetch(`${apiUrl}${path}?page=${page}&limit=50`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`Catalogue request failed with status ${response.status}`);
    }

    const result: CatalogResponse = await response.json();
    const items = result.data[key] ?? [];
    entries.push(
      ...items.map((item) => ({
        url: canonicalUrl(`${path}/${item.id}`),
        lastModified: new Date(item.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    );
    page += 1;

    if (page > 1000 && result.data.pagination.hasNextPage) {
      throw new Error(`The ${path} catalogue exceeds the sitemap page limit`);
    }
    if (!result.data.pagination.hasNextPage) break;
  } while (true);

  return entries;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: canonicalUrl('/music'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: canonicalUrl('/videos'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const [musicResult, videosResult] = await Promise.allSettled([
    getCatalogEntries('/music', 'releases'),
    getCatalogEntries('/videos', 'videos'),
  ]);

  if (musicResult.status === 'rejected') {
    console.error('Unable to add music releases to the sitemap:', musicResult.reason);
  }
  if (videosResult.status === 'rejected') {
    console.error('Unable to add videos to the sitemap:', videosResult.reason);
  }

  const musicEntries = musicResult.status === 'fulfilled' ? musicResult.value : [];
  const videoEntries = videosResult.status === 'fulfilled' ? videosResult.value : [];

  return [...staticPages, ...musicEntries, ...videoEntries];
}
