import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  MyProfileResponse,
  PublicProfileResponse,
  UpdateProfileInput,
} from '@/types/profile';

export const useMyProfile = () =>
  useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api<MyProfileResponse>('/profile/me'),
    retry: false,
  });

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api<MyProfileResponse>('/profile/me', {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(['profile', 'me'], response);
    },
  });
};

export const usePublicProfile = (username: string) =>
  useQuery({
    queryKey: ['profile', username],
    queryFn: () =>
      api<PublicProfileResponse>(`/profile/${encodeURIComponent(username)}`),
    enabled: username.length > 0,
    retry: false,
  });
