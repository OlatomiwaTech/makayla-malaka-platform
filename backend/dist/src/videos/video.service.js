import { prisma } from '../lib/prisma.js';
import { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl, } from '../lib/youtube.js';
import { getYouTubeVideoMetadata } from './youtube-metadata.service.js';
export const previewVideo = (url) => getYouTubeVideoMetadata(url);
export const createVideo = async (input) => {
    const youtubeVideoId = extractYouTubeVideoId(input.youtubeUrl);
    if (!youtubeVideoId) {
        throw new Error('Invalid YouTube video URL');
    }
    const metadata = await getYouTubeVideoMetadata(input.youtubeUrl);
    const existingVideo = await prisma.video.findUnique({
        where: {
            youtubeVideoId,
        },
    });
    if (existingVideo) {
        throw new Error('This YouTube video has already been added');
    }
    return prisma.video.create({
        data: {
            youtubeVideoId,
            title: input.title || metadata.title,
            description: input.description?.trim() || metadata.description,
            seoTitle: input.seoTitle || null,
            seoDescription: input.seoDescription || null,
            thumbnailUrl: input.thumbnailUrl ??
                metadata.thumbnailUrl ??
                getYouTubeThumbnailUrl(youtubeVideoId),
            channelTitle: metadata.channelTitle,
            sourcePublishedAt: metadata.sourcePublishedAt,
            durationSeconds: metadata.durationSeconds,
            youtubeCategoryId: metadata.categoryId,
            videoUrl: getYouTubeEmbedUrl(youtubeVideoId),
            category: input.category,
            status: input.status,
            publishedAt: input.status === 'PUBLISHED'
                ? new Date()
                : null,
        },
    });
};
export const updateVideo = async (videoId, input) => {
    const existingVideo = await prisma.video.findUnique({
        where: { id: videoId },
    });
    if (!existingVideo) {
        throw new Error('Video not found');
    }
    let youtubeVideoId = existingVideo.youtubeVideoId;
    let metadata = null;
    if (input.youtubeUrl) {
        const extractedId = extractYouTubeVideoId(input.youtubeUrl);
        if (!extractedId) {
            throw new Error('Invalid YouTube video URL');
        }
        metadata = await getYouTubeVideoMetadata(input.youtubeUrl);
        youtubeVideoId = extractedId;
        if (youtubeVideoId !== existingVideo.youtubeVideoId) {
            const duplicateVideo = await prisma.video.findUnique({
                where: {
                    youtubeVideoId,
                },
            });
            if (duplicateVideo) {
                throw new Error('This YouTube video has already been added');
            }
        }
    }
    let publishedAt = existingVideo.publishedAt;
    if (input.status === 'PUBLISHED' &&
        existingVideo.status !== 'PUBLISHED') {
        publishedAt = new Date();
    }
    if (input.status === 'DRAFT') {
        publishedAt = null;
    }
    return prisma.video.update({
        where: { id: videoId },
        data: {
            youtubeVideoId,
            videoUrl: getYouTubeEmbedUrl(youtubeVideoId),
            ...(input.title !== undefined
                ? { title: input.title }
                : {}),
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.seoTitle !== undefined
                ? { seoTitle: input.seoTitle || null }
                : {}),
            ...(input.seoDescription !== undefined
                ? { seoDescription: input.seoDescription || null }
                : {}),
            ...(metadata
                ? {
                    channelTitle: metadata.channelTitle,
                    sourcePublishedAt: metadata.sourcePublishedAt,
                    durationSeconds: metadata.durationSeconds,
                    youtubeCategoryId: metadata.categoryId,
                }
                : {}),
            ...(input.thumbnailUrl !== undefined
                ? { thumbnailUrl: input.thumbnailUrl }
                : metadata
                    ? {
                        thumbnailUrl: metadata.thumbnailUrl,
                    }
                    : {}),
            ...(input.category !== undefined
                ? { category: input.category }
                : {}),
            ...(input.status !== undefined
                ? { status: input.status }
                : {}),
            publishedAt,
        },
    });
};
export const getPublishedVideos = async (page, limit, category) => {
    const skip = (page - 1) * limit;
    const where = {
        status: 'PUBLISHED',
        ...(category ? { category } : {}),
    };
    const [videos, total] = await Promise.all([
        prisma.video.findMany({
            where,
            orderBy: {
                publishedAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.video.count({ where }),
    ]);
    return {
        videos,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
        },
    };
};
export const getManagedVideos = async (query) => {
    const skip = (query.page - 1) * query.limit;
    const where = {
        ...(query.status ? { status: query.status } : {}),
        ...(query.category ? { category: query.category } : {}),
        ...(query.search
            ? { title: { contains: query.search, mode: 'insensitive' } }
            : {}),
    };
    const [videos, total, categories] = await Promise.all([
        prisma.video.findMany({
            where,
            orderBy: [{ updatedAt: 'desc' }],
            skip,
            take: query.limit,
        }),
        prisma.video.count({ where }),
        prisma.video.findMany({
            distinct: ['category'],
            select: { category: true },
            orderBy: { category: 'asc' },
        }),
    ]);
    return {
        videos,
        categories: categories.map(({ category }) => category),
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
            hasNextPage: query.page * query.limit < total,
        },
    };
};
export const getPublishedVideoById = async (videoId) => {
    const video = await prisma.video.findFirst({
        where: {
            id: videoId,
            status: 'PUBLISHED',
        },
    });
    if (!video) {
        throw new Error('Video not found');
    }
    return video;
};
//# sourceMappingURL=video.service.js.map