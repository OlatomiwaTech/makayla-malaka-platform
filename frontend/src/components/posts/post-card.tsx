import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import type { Post } from '@/types/post';

type PostCardProps = {
	post: Post;
};

export function PostCard({ post }: PostCardProps) {
	const authorName =
		post.author.profile?.displayName ??
		post.author.username;

	return (
		<article className="group overflow-hidden rounded-[28px] border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
			{post.imageUrl ? (
				<div className="aspect-[4/3] overflow-hidden bg-zinc-100">
					<img
						src={post.imageUrl}
						alt=""
						className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
					/>
				</div>
			) : (
				<div className="relative aspect-[4/3] overflow-hidden bg-[#222]">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,255,66,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.22),transparent_38%)]" />

					<div className="absolute bottom-6 left-6">
						<span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
							Makayla
						</span>
					</div>
				</div>
			)}

			<div className="p-5 sm:p-6">
				<div className="mb-5 flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold">{authorName}</p>
						<p className="mt-1 text-xs text-black/40">
							@{post.author.username}
						</p>
					</div>

					<span className="text-xs text-black/35">
						{post.publishedAt
							? new Date(post.publishedAt).toLocaleDateString(
									'en-US',
									{
										month: 'short',
										day: 'numeric',
									},
								)
							: ''}
					</span>
				</div>

				{post.title && (
					<h3 className="text-xl font-semibold tracking-[-0.03em]">
						{post.title}
					</h3>
				)}

				<p className="mt-3 line-clamp-3 text-sm leading-6 text-black/55">
					{post.content}
				</p>

				<Link
					href={`/posts/${post.id}`}
					className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
				>
					Read update
					<ArrowUpRight size={15} />
				</Link>
			</div>
		</article>
	);
}
