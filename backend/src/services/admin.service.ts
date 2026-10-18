import { prisma } from '../lib/prisma.js';
import type { UpdateContentRoleInput } from '../schemas/admin.schema.js';

export const listManagedAccounts = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
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
        },
      },
    },
  });
};

export const updateManagedAccountRole = async (
  userId: string,
  input: UpdateContentRoleInput,
) => {
  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  if (account.role === 'ADMIN') {
    throw new Error('The owner admin account cannot be changed here');
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: input.role },
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
        },
      },
    },
  });
};
