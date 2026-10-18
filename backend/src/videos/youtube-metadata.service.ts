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
  metadataSource: 'youtube-data-api';
};

type YouTubeApiVideo = {
  snippet?: {
    channelId?: string;
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

type YouTubeApiChannel = { id?: string };

let resolvedOfficialChannel: { handle: string; id: string } | null = null;
let officialChannelLookup: Promise<string> | null = null;

const videoDurationSeconds = (duration: string | undefined) => {
  if (!duration) return null;

  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
};

const requestJson = async <T>(url: URL, apiKey: string): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      headers: {
        Accept: 'application/json',
        'x-goog-api-key': apiKey,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('YouTube metadata request timed out');
    }

    throw new Error('YouTube metadata service is unreachable');
  }

  if (!response.ok) {
    let detail = '';

    try {
      const body = (await response.json()) as {
        error?: {
          message?: string;
          errors?: Array<{ reason?: string }>;
        };
      };
      const reason = body.error?.errors?.[0]?.reason;
      const message = body.error?.message?.trim();
      detail = [reason, message].filter(Boolean).join(': ');
    } catch {
      // Keep the HTTP status when the provider does not return JSON.
    }

    throw new Error(
      `YouTube metadata request failed (${response.status})${detail ? `: ${detail}` : ''}`,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('YouTube metadata service returned an invalid response');
  }
};

const getOfficialChannelId = async (apiKey: string) => {
  if (env.YOUTUBE_CHANNEL_ID) return env.YOUTUBE_CHANNEL_ID;

  const handle = env.YOUTUBE_CHANNEL_HANDLE;
  if (resolvedOfficialChannel?.handle === handle) {
    return resolvedOfficialChannel.id;
  }

  if (!officialChannelLookup) {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels');
    url.searchParams.set('part', 'id');
    url.searchParams.set('forHandle', handle);
    officialChannelLookup = requestJson<{ items?: YouTubeApiChannel[] }>(url, apiKey)
      .then((result) => {
        const channelId = result.items?.[0]?.id;
        if (!channelId) {
          throw new Error('Configured YouTube channel could not be found');
        }

        resolvedOfficialChannel = { handle, id: channelId };
        return channelId;
      })
      .catch((error: unknown) => {
        officialChannelLookup = null;
        throw error;
      });
  }

  return officialChannelLookup;
};

const metadataFromYouTubeApi = async (
  videoId: string,
  apiKey: string,
  approvedChannelId: string,
): Promise<YouTubeVideoMetadata> => {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('id', videoId);

  const result = await requestJson<{ items?: YouTubeApiVideo[] }>(url, apiKey);
  const video = result.items?.[0];
  const snippet = video?.snippet;

  if (!snippet?.channelId) {
    throw new Error('Could not verify the YouTube channel for this video');
  }

  if (snippet.channelId !== approvedChannelId) {
    throw new Error('This video is not from Makayla’s official YouTube channel');
  }

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

export const getYouTubeVideoMetadata = async (
  value: string,
): Promise<YouTubeVideoMetadata> => {
  const videoId = extractYouTubeVideoId(value);
  if (!videoId) {
    throw new Error('Invalid YouTube video URL');
  }

  const apiKey = env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YouTube channel verification is not configured');
  }

  const approvedChannelId = await getOfficialChannelId(apiKey);
  return metadataFromYouTubeApi(videoId, apiKey, approvedChannelId);
};
