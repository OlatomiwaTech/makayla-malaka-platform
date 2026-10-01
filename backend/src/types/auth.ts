export type UserRole = 'FAN' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
};

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
  displayName?: string | undefined;
  bio?: string | undefined;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};
