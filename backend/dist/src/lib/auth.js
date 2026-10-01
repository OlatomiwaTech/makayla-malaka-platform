import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;
export const hashPassword = async (password) => bcrypt.hash(password, 12);
export const comparePassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);
export const signToken = (payload) => jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
});
export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);
export const createAccessToken = (userId, role, email, username) => jwt.sign({
    sub: userId,
    role,
    email,
    username,
}, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
});
export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET);
export const createRefreshToken = () => crypto.randomBytes(48).toString('hex');
export const hashRefreshToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
export const getRefreshTokenExpiry = () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
    return expiry;
};
//# sourceMappingURL=auth.js.map