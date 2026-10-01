import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { AuthTokenPayload, UserRole } from '../types/auth.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

export type AccessTokenPayload = AuthTokenPayload;

export const hashPassword = async (password: string) => bcrypt.hash(password, 12);

export const comparePassword = async (
  password: string,
  passwordHash: string,
) => bcrypt.compare(password, passwordHash);

export const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

export const createAccessToken = (
  userId: string,
  role: UserRole,
  email: string,
  username: string,
): string =>
  jwt.sign(
    {
      sub: userId,
      role,
      email,
      username,
    },
    env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

export const createRefreshToken = () => crypto.randomBytes(48).toString('hex');

export const hashRefreshToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const getRefreshTokenExpiry = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
  return expiry;
};