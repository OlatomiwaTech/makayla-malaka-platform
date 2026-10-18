'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

import { api } from '@/lib/api';
import type { Post } from '@/types/post';

type PostResponse = {
  success: boolean;
  data: { post: Post };
};

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const query = useQuery({
    queryKey: ['post-detail', id],
    queryFn: () => api<PostResponse>(`/posts/${encodeURIComponent(id)}`),
  });

  if (query.isPending) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-80 animate-pulse bg-white" aria-label="Loading update" />
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Update not found</h1>
        <p className="mt-2 text-sm text-black/55">This update may have been removed or is not publicly available.</p>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 font-semibold hover:text-[#c30c6c]">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </main>
    );
  }

  const post = query.data.data.post;
  const publishedAt = post.publishedAt ?? post.createdAt;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Link href="/#latest-updates" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
        <ArrowLeft size={16} /> Latest updates
      </Link>
      <header className="mx-auto mt-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c30c6c]">
          Makayla Malaka · Update
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
          {post.title || 'Latest update'}
        </h1>
        <time dateTime={publishedAt} className="mt-5 block text-sm text-black/50">
          {new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(publishedAt))}
        </time>
      </header>
      {post.imageUrl && (
        <div className="relative mx-auto mt-8 aspect-[16/10] max-w-4xl bg-[#ece8e2]">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}
      <div className="mx-auto mt-8 max-w-3xl whitespace-pre-wrap text-base leading-8 text-black/75 sm:text-lg">
        {post.content}
      </div>
    </article>
  );
}
