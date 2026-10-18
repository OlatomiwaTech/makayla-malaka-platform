export type Video = {
  id: string;
  youtubeVideoId: string;
  title: string;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailUrl: string | null;
  category: string;
  channelTitle: string | null;
  sourcePublishedAt: string | null;
  durationSeconds: number | null;
  youtubeCategoryId: string | null;
  status:
    | 'DRAFT'
    | 'PUBLISHED'
    | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VideosResponse = {
  success: boolean;
  data: {
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
};
