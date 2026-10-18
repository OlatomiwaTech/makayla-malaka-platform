import type { MusicRelease } from '@/types/music';
import type { Video } from '@/types/video';

const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'
).replace(/\/+$/, '');

export const siteUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return new URL(configuredUrl);
};

export const canonicalUrl = (path: string) =>
  new URL(path, siteUrl()).toString();

const fetchSeoRecord = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${apiUrl}${path}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const body: { data?: { release?: T; video?: T } } = await response.json();
    return body.data?.release ?? body.data?.video ?? null;
  } catch (error) {
    console.error(`Unable to fetch SEO metadata for ${path}:`, error);
    return null;
  }
};

export const getPublicReleaseForSeo = (id: string) =>
  fetchSeoRecord<MusicRelease>(`/music/${encodeURIComponent(id)}`);

export const getPublicVideoForSeo = (id: string) =>
  fetchSeoRecord<Video>(`/videos/${encodeURIComponent(id)}`);

export const jsonLd = (value: Record<string, unknown>) => ({
  __html: JSON.stringify(value).replace(/</g, '\\u003c'),
});

export const plainText = (value: string) =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const descriptionForSeo = (
  preferred: string | null | undefined,
  fallback: string | null | undefined,
) => {
  const value = plainText(preferred?.trim() || fallback?.trim() || '');
  if (value.length <= 160) return value;
  return `${value.slice(0, 157).trimEnd()}...`;
};

export const isoDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const duration = `${hours ? `${hours}H` : ''}${minutes ? `${minutes}M` : ''}${remainingSeconds ? `${remainingSeconds}S` : ''}`;
  return `PT${duration || '0S'}`;
};
