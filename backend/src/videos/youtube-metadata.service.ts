import { env } from '../config/env.js';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../lib/youtube.js';

export type YouTubeVideoMetadata = {
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  channelTitle: string | null;
  sourcePublishedAt: Date | null;
  durationSeconds: number | null;
  categoryId: string | null;
  metadataSource: 'youtube-data-api' | 'youtube-oembed';
};

type YouTubeApiVideo = {
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    categoryId?: string;
    thumbnails?: Record<string, { url?: string } | undefined>;
  };
  contentDetails?: {
    duration?: string;
  };
};

const videoDurationSeconds = (duration: string | undefined) => {
  if (!duration) return null;

  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
};

const requestJson = async <T>(url: URL): Promise<T> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`YouTube metadata request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
};

const metadataFromYouTubeApi = async (
  videoId: string,
  apiKey: string,
): Promise<YouTubeVideoMetadata> => {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('id', videoId);
  url.searchParams.set('key', apiKey);

  const result = await requestJson<{ items?: YouTubeApiVideo[] }>(url);
  const video = result.items?.[0];
  const snippet = video?.snippet;

  if (!snippet?.title) {
    throw new Error('YouTube video was not found or is not publicly available');
  }

  const thumbnails = snippet.thumbnails ?? {};
  const thumbnailUrl =
    thumbnails.maxres?.url ??
    thumbnails.standard?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    getYouTubeThumbnailUrl(videoId);
  const sourcePublishedAt = snippet.publishedAt
    ? new Date(snippet.publishedAt)
    : null;

  return {
    videoId,
    title: snippet.title,
    description: snippet.description || null,
    thumbnailUrl,
    channelTitle: snippet.channelTitle ?? null,
    sourcePublishedAt:
      sourcePublishedAt && !Number.isNaN(sourcePublishedAt.getTime())
        ? sourcePublishedAt
        : null,
    durationSeconds: videoDurationSeconds(video?.contentDetails?.duration),
    categoryId: snippet.categoryId ?? null,
    metadataSource: 'youtube-data-api',
  };
};

const metadataFromOEmbed = async (
  videoId: string,
  originalUrl: string,
): Promise<YouTubeVideoMetadata> => {
  const url = new URL('https://www.youtube.com/oembed');
  url.searchParams.set('url', originalUrl);
  url.searchParams.set('format', 'json');

  const result = await requestJson<{
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
  }>(url);

  if (!result.title) {
    throw new Error('YouTube video was not found or is not publicly available');
  }

  return {
    videoId,
    title: result.title,
    description: null,
    thumbnailUrl: result.thumbnail_url ?? getYouTubeThumbnailUrl(videoId),
    channelTitle: result.author_name ?? null,
    sourcePublishedAt: null,
    durationSeconds: null,
    categoryId: null,
    metadataSource: 'youtube-oembed',
  };
};

export const getYouTubeVideoMetadata = async (
  value: string,
): Promise<YouTubeVideoMetadata> => {
  const videoId = extractYouTubeVideoId(value);
  if (!videoId) {
    throw new Error('Invalid YouTube video URL');
  }

  const apiKey = env.YOUTUBE_API_KEY;
  if (apiKey) {
    return metadataFromYouTubeApi(videoId, apiKey);
  }

  return metadataFromOEmbed(
    videoId,
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
  );
};
