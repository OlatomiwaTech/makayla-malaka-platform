import { prisma } from '../lib/prisma.js';

import type {
  CreatePostInput,
  UpdatePostInput,
} from '../schemas/post.schema.js';

export const createPost = async (
  authorId: string,
  input: CreatePostInput,
) => {
  const publishedAt =
    input.status === 'PUBLISHED'
      ? new Date()
      : null;

  return prisma.post.create({
    data: {
      authorId,
      title: input.title,
      content: input.content,
      imageUrl: input.imageUrl,
      status: input.status,
      publishedAt,
    },
    include: {
      author: {
        select: {
          username: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
};

export const updatePost = async (
  postId: string,
  input: UpdatePostInput,
) => {
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!existingPost) {
    throw new Error('Post not found');
  }

  let publishedAt = existingPost.publishedAt;

  if (
    input.status === 'PUBLISHED' &&
    existingPost.status !== 'PUBLISHED'
  ) {
    publishedAt = new Date();
  }

  if (input.status === 'DRAFT') {
    publishedAt = null;
  }

  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),

      ...(input.content !== undefined
        ? { content: input.content }
        : {}),

      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl }
        : {}),

      ...(input.status !== undefined
        ? { status: input.status }
        : {}),

      publishedAt,
    },
    include: {
      author: {
        select: {
          username: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
};

export const getPublishedPosts = async (
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          not: null,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            username: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    }),

    prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          not: null,
        },
      },
    }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  };
};

export const getPublishedPostById = async (
  postId: string,
) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      status: 'PUBLISHED',
      publishedAt: {
        not: null,
      },
    },
    include: {
      author: {
        select: {
          username: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};