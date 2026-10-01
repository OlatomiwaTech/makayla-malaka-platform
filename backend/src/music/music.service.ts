import { prisma } from '../lib/prisma.js';

import type {
	CreateReleaseInput,
	UpdateReleaseInput,
} from '../schemas/music.schema.js';

const publicReleaseInclude = {
	tracks: {
		orderBy: {
			trackNumber: 'asc' as const,
		},
	},
	links: {
		orderBy: {
			platform: 'asc' as const,
		},
	},
};

export const createRelease = async (
	input: CreateReleaseInput,
) => {
	return prisma.musicRelease.create({
		data: {
			title: input.title,
			...(input.description !== undefined
				? { description: input.description }
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

export const updateRelease = async (
	releaseId: string,
	input: UpdateReleaseInput,
) => {
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
				...(input.description !== undefined
					? { description: input.description }
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

export const getPublishedReleases = async (
	page: number,
	limit: number,
) => {
	const skip = (page - 1) * limit;

	const where = {
		status: 'PUBLISHED' as const,
	};

	const [releases, total] = await prisma.$transaction([
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
		},
		orderBy: {
			releaseDate: 'desc',
		},
		include: publicReleaseInclude,
	});
};

export const getPublishedReleaseById = async (
	releaseId: string,
) => {
	const release = await prisma.musicRelease.findFirst({
		where: {
			id: releaseId,
			status: 'PUBLISHED',
		},
		include: publicReleaseInclude,
	});

	if (!release) {
		throw new Error('Music release not found');
	}

	return release;
};
