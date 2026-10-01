import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  FeaturedMusicResponse,
  MusicResponse,
} from '@/types/music';

export const useMusic = (page = 1) => {
  return useQuery({
    queryKey: ['music', page],

    queryFn: () =>
      api<MusicResponse>(
        `/music?page=${page}&limit=12`,
      ),
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
