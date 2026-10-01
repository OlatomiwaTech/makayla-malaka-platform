import { prisma } from '../lib/prisma.js';

import type { CreatePostInput, UpdatePostInput } from '../schemas/post.schema.js';

export const getPosts = async () => {
  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      comments: true,
      likes: true,
    },
  });
};

export const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
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
      },
      likes: true,
    },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

export const createPost = async (authorId: string, input: CreatePostInput) => {
  return prisma.post.create({
    data: {
      authorId,
      title: input.title ?? null,
      content: input.content,
      imageUrl: input.imageUrl ?? null,
      status: input.status ?? 'DRAFT',
    },
    include: {
      author: {
        select: {
          id: true,
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

export const updatePost = async (postId: string, authorId: string, input: UpdatePostInput) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== authorId) {
    throw new Error('You are not allowed to update this post');
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
  });
};

export const deletePost = async (postId: string, authorId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== authorId) {
    throw new Error('You are not allowed to delete this post');
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { success: true };
};
