import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { AuthTokenPayload } from '../types/auth.js';

export const hashPassword = async (password: string) => bcrypt.hash(password, 12);

export const comparePassword = async (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);

export const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

export type AccessTokenPayload = {
  sub: string;
  role: string;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  passwordHash: string,
) => {
  return bcrypt.compare(password, passwordHash);
};

export const createAccessToken = (
  userId: string,
  role: string,
): string => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

export const verifyAccessToken = (
  token: string,
): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
};

export const createRefreshToken = () => {
  return crypto.randomBytes(48).toString('hex');
};

export const hashRefreshToken = (token: string) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

export const getRefreshTokenExpiry = () => {
  const expiry = new Date();

  expiry.setDate(
    expiry.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS,
  );

  return expiry;
};