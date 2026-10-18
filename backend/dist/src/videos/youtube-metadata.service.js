import { env } from '../config/env.js';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../lib/youtube.js';
const videoDurationSeconds = (duration) => {
    if (!duration)
        return null;
    const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!match)
        return null;
    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);
    const seconds = Number(match[3] ?? 0);
    return hours * 3600 + minutes * 60 + seconds;
};
const requestJson = async (url) => {
    let response;
    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(8_000),
            headers: { Accept: 'application/json' },
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'TimeoutError') {
            throw new Error('YouTube metadata request timed out');
        }
        throw new Error('YouTube metadata service is unreachable');
    }
    if (!response.ok) {
        throw new Error(`YouTube metadata request failed (${response.status})`);
    }
    try {
        return (await response.json());
    }
    catch {
        throw new Error('YouTube metadata service returned an invalid response');
    }
};
const metadataFromYouTubeApi = async (videoId, apiKey, approvedChannelId) => {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('id', videoId);
    url.searchParams.set('key', apiKey);
    const result = await requestJson(url);
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
    const thumbnailUrl = thumbnails.maxres?.url ??
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
        sourcePublishedAt: sourcePublishedAt && !Number.isNaN(sourcePublishedAt.getTime())
            ? sourcePublishedAt
            : null,
        durationSeconds: videoDurationSeconds(video?.contentDetails?.duration),
        categoryId: snippet.categoryId ?? null,
        metadataSource: 'youtube-data-api',
    };
};
export const getYouTubeVideoMetadata = async (value) => {
    const videoId = extractYouTubeVideoId(value);
    if (!videoId) {
        throw new Error('Invalid YouTube video URL');
    }
    const apiKey = env.YOUTUBE_API_KEY;
    const approvedChannelId = env.YOUTUBE_CHANNEL_ID;
    if (!apiKey || !approvedChannelId) {
        throw new Error('YouTube channel verification is not configured');
    }
    return metadataFromYouTubeApi(videoId, apiKey, approvedChannelId);
};
//# sourceMappingURL=youtube-metadata.service.js.map