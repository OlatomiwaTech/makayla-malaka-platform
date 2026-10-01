import { prisma } from '../lib/prisma.js';
export const createVideo = async (input) => {
    return prisma.video.create({
        data: {
            title: input.title,
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.thumbnailUrl !== undefined
                ? { thumbnailUrl: input.thumbnailUrl }
                : {}),
            videoUrl: input.videoUrl,
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
            ...(input.title !== undefined
                ? { title: input.title }
                : {}),
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.thumbnailUrl !== undefined
                ? { thumbnailUrl: input.thumbnailUrl }
                : {}),
            ...(input.videoUrl !== undefined
                ? { videoUrl: input.videoUrl }
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
    const [videos, total] = await prisma.$transaction([
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