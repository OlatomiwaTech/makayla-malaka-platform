import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const hashPassword = async (password) => bcrypt.hash(password, 12);
export const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);
export const signToken = (payload) => jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
});
export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);
//# sourceMappingURL=auth.js.map