import { prisma } from '../lib/prisma.js';

import type { UpdateProfileInput } from '../schemas/profile.schema.js';

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateMyProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  const updatedProfile = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      ...(input.displayName !== undefined
        ? { displayName: input.displayName }
        : {}),
      ...(input.bio !== undefined
        ? { bio: input.bio }
        : {}),
      ...(input.avatarUrl !== undefined
        ? { avatarUrl: input.avatarUrl }
        : {}),
    },
  });

  return updatedProfile;
};

export const getPublicProfile = async (
  username: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('Profile not found');
  }

  return user;
};