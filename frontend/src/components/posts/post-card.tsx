import Image from 'next/image';
import Link from 'next/link';

import type { Post } from '@/types/post';

type PostCardProps = {
	post: Post;
};

export function PostCard({
	post,
}: PostCardProps) {
	const authorName =
		post.author.profile?.displayName ??
		post.author.username;

	return (
		<article className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
			{post.imageUrl && (
				<div className="relative aspect-[4/3] overflow-hidden">
					<Image
						src={post.imageUrl}
						alt=""
						fill
						className="object-cover"
					/>
				</div>
			)}

			<div className="p-5">
				<div className="mb-4 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium">
						{authorName.charAt(0).toUpperCase()}
					</div>

					<div>
						<p className="text-sm font-medium">
							{authorName}
						</p>

						<p className="text-xs text-zinc-500">
							@{post.author.username}
						</p>
					</div>
				</div>

				{post.title && (
					<h2 className="mb-2 text-xl font-semibold tracking-tight">
						{post.title}
					</h2>
				)}

				<p className="line-clamp-4 text-sm leading-6 text-zinc-600">
					{post.content}
				</p>

				<Link
					href={`/posts/${post.id}`}
					className="mt-4 inline-block text-sm font-medium"
				>
					Read more →
				</Link>
			</div>
		</article>
	);
}
