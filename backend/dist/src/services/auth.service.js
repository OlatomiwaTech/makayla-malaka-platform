import { prisma } from '../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
const toAuthUser = (user) => ({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
});
export const registerUser = async (input) => {
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
export const loginUser = async (input) => {
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
//# sourceMappingURL=auth.service.js.map