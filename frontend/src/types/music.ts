export type ReleaseType =
  | 'SINGLE'
  | 'EP'
  | 'ALBUM';

export type ReleaseStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type Track = {
  id: string;
  title: string;
  trackNumber: number;
  durationSeconds: number | null;
  previewUrl: string | null;
};

export type MusicPlatformLink = {
  id: string;
  platform: string;
  url: string;
};

export type MusicRelease = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  releaseDate: string;
  type: ReleaseType;
  status: ReleaseStatus;
  isFeatured: boolean;
  tracks: Track[];
  links: MusicPlatformLink[];
  createdAt: string;
  updatedAt: string;
};

export type MusicResponse = {
  success: boolean;
  data: {
    releases: MusicRelease[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
};

export type FeaturedMusicResponse = {
  success: boolean;
  data: {
    release: MusicRelease | null;
  };
};
