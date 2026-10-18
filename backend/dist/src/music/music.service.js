import { prisma } from '../lib/prisma.js';
const publicReleaseInclude = {
    tracks: {
        orderBy: {
            trackNumber: 'asc',
        },
    },
    links: {
        orderBy: {
            platform: 'asc',
        },
    },
};
export const createRelease = async (input) => {
    return prisma.musicRelease.create({
        data: {
            title: input.title,
            artistName: input.artistName,
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.seoTitle !== undefined
                ? { seoTitle: input.seoTitle || null }
                : {}),
            ...(input.seoDescription !== undefined
                ? { seoDescription: input.seoDescription || null }
                : {}),
            ...(input.coverUrl !== undefined
                ? { coverUrl: input.coverUrl }
                : {}),
            releaseDate: input.releaseDate,
            type: input.type,
            status: input.status,
            isFeatured: input.isFeatured,
            tracks: {
                create: input.tracks.map((track) => ({
                    title: track.title,
                    trackNumber: track.trackNumber,
                    ...(track.durationSeconds !== undefined
                        ? { durationSeconds: track.durationSeconds }
                        : {}),
                    ...(track.previewUrl !== undefined
                        ? { previewUrl: track.previewUrl }
                        : {}),
                })),
            },
            links: {
                create: input.links,
            },
        },
        include: publicReleaseInclude,
    });
};
export const updateRelease = async (releaseId, input) => {
    const existingRelease = await prisma.musicRelease.findUnique({
        where: {
            id: releaseId,
        },
    });
    if (!existingRelease) {
        throw new Error('Music release not found');
    }
    return prisma.$transaction(async (tx) => {
        await tx.musicRelease.update({
            where: {
                id: releaseId,
            },
            data: {
                ...(input.title !== undefined
                    ? { title: input.title }
                    : {}),
                ...(input.artistName !== undefined
                    ? { artistName: input.artistName }
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
                ...(input.coverUrl !== undefined
                    ? { coverUrl: input.coverUrl }
                    : {}),
                ...(input.releaseDate !== undefined
                    ? { releaseDate: input.releaseDate }
                    : {}),
                ...(input.type !== undefined
                    ? { type: input.type }
                    : {}),
                ...(input.status !== undefined
                    ? { status: input.status }
                    : {}),
                ...(input.isFeatured !== undefined
                    ? { isFeatured: input.isFeatured }
                    : {}),
            },
        });
        if (input.tracks) {
            await tx.track.deleteMany({
                where: {
                    releaseId,
                },
            });
            await tx.track.createMany({
                data: input.tracks.map((track) => ({
                    releaseId,
                    title: track.title,
                    trackNumber: track.trackNumber,
                    ...(track.durationSeconds !== undefined
                        ? { durationSeconds: track.durationSeconds }
                        : {}),
                    ...(track.previewUrl !== undefined
                        ? { previewUrl: track.previewUrl }
                        : {}),
                })),
            });
        }
        if (input.links) {
            await tx.musicPlatformLink.deleteMany({
                where: {
                    releaseId,
                },
            });
            await tx.musicPlatformLink.createMany({
                data: input.links.map((link) => ({
                    releaseId,
                    platform: link.platform,
                    url: link.url,
                })),
            });
        }
        return tx.musicRelease.findUnique({
            where: {
                id: releaseId,
            },
            include: publicReleaseInclude,
        });
    });
};
export const getPublishedReleases = async (page, limit, type) => {
    const skip = (page - 1) * limit;
    const where = {
        status: 'PUBLISHED',
        ...(type ? { type } : {}),
        releaseDate: {
            lte: new Date(),
        },
    };
    const [releases, total] = await Promise.all([
        prisma.musicRelease.findMany({
            where,
            orderBy: {
                releaseDate: 'desc',
            },
            skip,
            take: limit,
            include: publicReleaseInclude,
        }),
        prisma.musicRelease.count({
            where,
        }),
    ]);
    return {
        releases,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
        },
    };
};
export const getFeaturedRelease = async () => {
    return prisma.musicRelease.findFirst({
        where: {
            status: 'PUBLISHED',
            isFeatured: true,
            releaseDate: {
                lte: new Date(),
            },
        },
        orderBy: {
            releaseDate: 'desc',
        },
        include: publicReleaseInclude,
    });
};
export const getPublishedReleaseById = async (releaseId) => {
    const release = await prisma.musicRelease.findFirst({
        where: {
            id: releaseId,
            status: 'PUBLISHED',
            releaseDate: {
                lte: new Date(),
            },
        },
        include: publicReleaseInclude,
    });
    if (!release) {
        throw new Error('Music release not found');
    }
    return release;
};
export const getManagedReleases = async (query) => {
    const skip = (query.page - 1) * query.limit;
    const where = {
        ...(query.status ? { status: query.status } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.search
            ? {
                OR: [
                    {
                        title: {
                            contains: query.search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        artistName: {
                            contains: query.search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : {}),
        ...(query.dateFrom || query.dateTo
            ? {
                releaseDate: {
                    ...(query.dateFrom ? { gte: query.dateFrom } : {}),
                    ...(query.dateTo ? { lte: query.dateTo } : {}),
                },
            }
            : {}),
    };
    const [releases, total] = await Promise.all([
        prisma.musicRelease.findMany({
            where,
            orderBy: {
                releaseDate: 'desc',
            },
            skip,
            take: query.limit,
            include: publicReleaseInclude,
        }),
        prisma.musicRelease.count({ where }),
    ]);
    return {
        releases,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
            hasNextPage: query.page * query.limit < total,
        },
    };
};
export const getManagedReleaseById = async (releaseId) => {
    const release = await prisma.musicRelease.findUnique({
        where: { id: releaseId },
        include: publicReleaseInclude,
    });
    if (!release) {
        throw new Error('Music release not found');
    }
    return release;
};
export const duplicateRelease = async (releaseId) => {
    const release = await getManagedReleaseById(releaseId);
    return prisma.musicRelease.create({
        data: {
            title: `${release.title.slice(0, 143)} (Copy)`,
            artistName: release.artistName,
            description: release.description,
            seoTitle: release.seoTitle,
            seoDescription: release.seoDescription,
            coverUrl: release.coverUrl,
            releaseDate: release.releaseDate,
            type: release.type,
            status: 'DRAFT',
            isFeatured: false,
            tracks: {
                create: release.tracks.map((track) => ({
                    title: track.title,
                    trackNumber: track.trackNumber,
                    durationSeconds: track.durationSeconds,
                    previewUrl: track.previewUrl,
                })),
            },
            links: {
                create: release.links.map((link) => ({
                    platform: link.platform,
                    url: link.url,
                })),
            },
        },
        include: publicReleaseInclude,
    });
};
//# sourceMappingURL=music.service.js.map