import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  FeaturedMusicResponse,
  MusicResponse,
  ReleaseType,
} from '@/types/music';

export const useMusic = (page = 1, type?: ReleaseType) => {
  return useQuery({
    queryKey: ['music', page, type],

    queryFn: () => {
      const search = new URLSearchParams({
        page: String(page),
        limit: '12',
      });

      if (type) search.set('type', type);

      return api<MusicResponse>(`/music?${search.toString()}`);
    },
  });
};

export const useFeaturedMusic = () => {
  return useQuery({
    queryKey: ['music', 'featured'],

    queryFn: () =>
      api<FeaturedMusicResponse>(
        '/music/featured',
      ),
  });
};
