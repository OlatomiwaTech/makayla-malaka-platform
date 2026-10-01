import type { UserRole, UserStatus } from '../../generated/prisma/client.js';

export type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
};