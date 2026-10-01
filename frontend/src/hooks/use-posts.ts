import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { PostsResponse } from '@/types/post';

export const usePosts = (page = 1) => {
	return useQuery({
		queryKey: ['posts', page],

		queryFn: () =>
			api<PostsResponse>(
				`/posts?page=${page}&limit=10`,
			),
	});
};
