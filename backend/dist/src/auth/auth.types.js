import { UserRole, UserStatus } from '../../generated/prisma/client.js';

export const AUTH_USER_ROLE_VALUES = Object.values(UserRole);
export const AUTH_USER_STATUS_VALUES = Object.values(UserStatus);

export const createAuthenticatedUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
  status: user.status,
});

export default createAuthenticatedUser;