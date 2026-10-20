import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
import { env } from '../config/env.js';
import type { BootstrapAdminSchema } from '../schemas/auth.schema.js';
import type { passwordResetRequestSchema, passwordResetVerifySchema } from '../schemas/auth.schema.js';
import type { z } from 'zod';
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from '../types/auth.js';

const toAuthUser = (user: {
  id: string;
  email: string;
  username: string;
  role: 'FAN' | 'MEDIA_EDITOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
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

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new Error('A user with that email or username already exists.');
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

type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
type PasswordResetVerify = z.infer<typeof passwordResetVerifySchema>;

const passwordResetOtpLifetimeMs = 10 * 60 * 1000;
const passwordResetResendCooldownMs = 60 * 1000;
const passwordResetMaxAttempts = 5;
const eligiblePasswordResetRoles = ['MEDIA_EDITOR', 'EDITOR', 'ADMIN'] as const;

const passwordResetCodeHash = (userId: string, code: string) =>
  crypto.createHmac('sha256', env.JWT_SECRET).update(`${userId}:${code}`).digest('hex');

const sendPasswordResetEmail = async (email: string, code: string) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    throw new Error('Password reset email is not configured');
  }

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(8_000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [email],
        subject: 'Your Makayla Malaka admin password reset code',
        text: `Your password reset code is ${code}. It expires in 10 minutes. If you did not request a password reset, you can ignore this email.`,
        html: `<p>Your password reset code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request a password reset, you can ignore this email.</p>`,
      }),
    });
  } catch {
    throw new Error('Password reset email could not be sent');
  }

  if (!response.ok) throw new Error('Password reset email could not be sent');
};

export const requestAdminPasswordReset = async (input: PasswordResetRequest) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    throw new Error('Password reset email is not configured');
  }

  const user = await prisma.user.findFirst({
    where: { email: input.email, role: { in: [...eligiblePasswordResetRoles] }, status: 'ACTIVE' },
    select: { id: true, email: true },
  });
  if (!user) return;

  const existing = await prisma.passwordResetOtp.findUnique({ where: { userId: user.id } });
  if (existing && Date.now() - existing.createdAt.getTime() < passwordResetResendCooldownMs) return;

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  const expiresAt = new Date(Date.now() + passwordResetOtpLifetimeMs);
  const codeHash = passwordResetCodeHash(user.id, code);
  await prisma.passwordResetOtp.upsert({
    where: { userId: user.id },
    create: { userId: user.id, codeHash, expiresAt },
    update: { codeHash, expiresAt, attempts: 0, createdAt: new Date() },
  });

  try {
    await sendPasswordResetEmail(user.email, code);
  } catch (error) {
    await prisma.passwordResetOtp.deleteMany({ where: { userId: user.id, codeHash } });
    throw error;
  }
};

export const completeAdminPasswordReset = async (input: PasswordResetVerify) => {
  const user = await prisma.user.findFirst({
    where: { email: input.email, role: { in: [...eligiblePasswordResetRoles] }, status: 'ACTIVE' },
    select: { id: true },
  });
  if (!user) throw new Error('Invalid or expired password reset code');

  const reset = await prisma.passwordResetOtp.findUnique({ where: { userId: user.id } });
  if (!reset || reset.expiresAt <= new Date() || reset.attempts >= passwordResetMaxAttempts) {
    throw new Error('Invalid or expired password reset code');
  }

  const expectedHash = Buffer.from(reset.codeHash, 'hex');
  const submittedHash = Buffer.from(passwordResetCodeHash(user.id, input.code), 'hex');
  const valid = expectedHash.length === submittedHash.length && crypto.timingSafeEqual(expectedHash, submittedHash);
  if (!valid) {
    await prisma.passwordResetOtp.update({ where: { userId: user.id }, data: { attempts: { increment: 1 } } });
    throw new Error('Invalid or expired password reset code');
  }

  const passwordHash = await hashPassword(input.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.passwordResetOtp.delete({ where: { userId: user.id } }),
    prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
  ]);
};
