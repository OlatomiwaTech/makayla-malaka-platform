'use client';

import { PostCard } from './post-card';

import { usePosts } from '@/hooks/use-posts';

export function PostList() {
	const {
		data,
		isLoading,
		isError,
	} = usePosts();

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 3 }).map(
					(_, index) => (
						<div
							key={index}
							className="h-48 animate-pulse rounded-3xl bg-zinc-200"
						/>
					),
				)}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
				We couldn't load Makayla's latest updates.
			</div>
		);
	}

	if (!data?.data.posts.length) {
		return (
			<div className="rounded-3xl bg-white p-8 text-center shadow-sm">
				<p className="font-medium">
					Nothing new yet.
				</p>

				<p className="mt-2 text-sm text-zinc-500">
					Check back soon for Makayla's latest updates.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-5">
			{data.data.posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
				/>
			))}
		</div>
	);
}
