import { prisma } from '../lib/prisma.js';

import type {
  CreateVideoInput,
  UpdateVideoInput,
} from '../schemas/video.schema.js';
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from '../lib/youtube.js';

const requireYouTubeVideoId = (youtubeUrl: string) => {
  const videoId = extractYouTubeVideoId(youtubeUrl);

  if (!videoId) {
    throw new Error('Enter a valid YouTube URL');
  }

  return videoId;
};

export const createVideo = async (
  input: CreateVideoInput,
) => {
  const youtubeVideoId = requireYouTubeVideoId(input.youtubeUrl);

  return prisma.video.create({
    data: {
      youtubeVideoId,
      title: input.title,
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.thumbnailUrl !== undefined
        ? { thumbnailUrl: input.thumbnailUrl }
        : { thumbnailUrl: getYouTubeThumbnailUrl(youtubeVideoId) }),
      videoUrl: getYouTubeEmbedUrl(youtubeVideoId),
      category: input.category,
      status: input.status,
      publishedAt:
        input.status === 'PUBLISHED'
          ? new Date()
          : null,
    },
  });
};

export const updateVideo = async (
  videoId: string,
  input: UpdateVideoInput,
) => {
  const existingVideo = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!existingVideo) {
    throw new Error('Video not found');
  }

  let publishedAt = existingVideo.publishedAt;

  if (
    input.status === 'PUBLISHED' &&
    existingVideo.status !== 'PUBLISHED'
  ) {
    publishedAt = new Date();
  }

  if (input.status === 'DRAFT') {
    publishedAt = null;
  }

  const youtubeVideoId = input.youtubeUrl !== undefined
    ? requireYouTubeVideoId(input.youtubeUrl)
    : undefined;
  const thumbnailUrl = input.thumbnailUrl !== undefined
    ? input.thumbnailUrl
    : youtubeVideoId !== undefined
      ? getYouTubeThumbnailUrl(youtubeVideoId)
      : undefined;

  return prisma.video.update({
    where: { id: videoId },
    data: {
      ...(youtubeVideoId !== undefined
        ? {
            youtubeVideoId,
            videoUrl: getYouTubeEmbedUrl(youtubeVideoId),
          }
        : {}),
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.thumbnailUrl !== undefined
        ? { thumbnailUrl: input.thumbnailUrl }
        : thumbnailUrl !== undefined
          ? { thumbnailUrl }
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

export const getPublishedVideos = async (
  page: number,
  limit: number,
  category?: string,
) => {
  const skip = (page - 1) * limit;

  const where = {
    status: 'PUBLISHED' as const,
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

export const getPublishedVideoById = async (
  videoId: string,
) => {
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
