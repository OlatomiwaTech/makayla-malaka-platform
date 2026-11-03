export type Profile = {
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type MyProfile = {
  id: string;
  email: string;
  username: string;
  role: 'FAN' | 'MEDIA_EDITOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  profile: Profile | null;
};

export type MyProfileResponse = {
  success: boolean;
  profile: MyProfile;
};

export type PublicProfile = {
  username: string;
  profile: Profile | null;
};

export type PublicProfileResponse = {
  success: boolean;
  profile: PublicProfile;
};

export type UpdateProfileInput = {
  displayName?: string;
  bio?: string;
  avatarUrl?: string | null;
};
