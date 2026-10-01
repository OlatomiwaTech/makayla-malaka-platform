import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { VideosResponse } from '@/types/video';

export const useVideos = (
  page = 1,
  category?: string,
) => {
  const search = new URLSearchParams({
    page: String(page),
    limit: '12',
  });

  if (category) {
    search.set('category', category);
  }

  return useQuery({
    queryKey: ['videos', page, category],
    queryFn: () =>
      api<VideosResponse>(
        `/videos?${search.toString()}`,
      ),
  });
};
