export type Video = {
  id: string;
  youtubeVideoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string;
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
