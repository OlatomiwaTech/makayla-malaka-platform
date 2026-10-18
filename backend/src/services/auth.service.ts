import { prisma } from '../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
import { env } from '../config/env.js';
import type { BootstrapAdminSchema } from '../schemas/auth.schema.js';
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from '../types/auth.js';

const toAuthUser = (user: {
  id: string;
  email: string;
  username: string;
  role: 'FAN' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
}): AuthUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
  status: user.status,
});

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error('A user with that email or username already exists.');
  }

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: await hashPassword(input.password),
      profile: {
        create: {
          displayName: input.displayName?.trim() || username,
          bio: input.bio?.trim() || null,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  return {
    user: toAuthUser(user),
    token,
  };
};

export const getAdminSetupStatus = async () => {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  return {
    available: !admin && Boolean(env.ADMIN_SETUP_KEY),
    setupKeyConfigured: Boolean(env.ADMIN_SETUP_KEY),
  };
};

export const bootstrapAdmin = async (
  input: BootstrapAdminSchema,
): Promise<AuthResponse> => {
  const configuredKey = env.ADMIN_SETUP_KEY;

  if (!configuredKey) {
    throw new Error('Admin setup is not configured');
  }

  if (input.setupKey !== configuredKey) {
    throw new Error('Invalid admin setup key');
  }

  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  try {
    const user = await prisma.$transaction(
      async (tx) => {
        const existingAdmin = await tx.user.findFirst({
          where: { role: 'ADMIN' },
          select: { id: true },
        });

        if (existingAdmin) {
          throw new Error('Admin setup has already been completed');
        }

        return tx.user.create({
          data: {
            email,
            username,
            passwordHash: await hashPassword(input.password),
            role: 'ADMIN',
            profile: {
              create: {
                displayName: input.displayName?.trim() || username,
                bio: input.bio?.trim() || null,
              },
            },
          },
        });
      },
      { isolationLevel: 'Serializable' },
    );

    const token = signToken({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return { user: toAuthUser(user), token };
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2034'
    ) {
      throw new Error('Admin setup has already been completed');
    }

    throw error;
  }
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  return {
    user: toAuthUser(user),
    token,
  };
};
