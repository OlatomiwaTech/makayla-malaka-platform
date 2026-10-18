'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Disc3, Search, Video } from 'lucide-react';

import { useMusic } from '@/hooks/use-music';
import { usePosts } from '@/hooks/use-posts';
import { useVideos } from '@/hooks/use-videos';

export function SearchExperience() {
  const [search, setSearch] = useState('');
  const musicQuery = useMusic();
  const videosQuery = useVideos();
  const postsQuery = usePosts();
  const term = search.trim().toLocaleLowerCase();

  const results = useMemo(() => {
    if (!term) return { music: [], videos: [], posts: [] };

    return {
      music: (musicQuery.data?.data.releases ?? []).filter((release) =>
        `${release.title} ${release.artistName} ${release.description ?? ''}`.toLocaleLowerCase().includes(term),
      ),
      videos: (videosQuery.data?.data.videos ?? []).filter((video) =>
        `${video.title} ${video.category} ${video.description ?? ''}`.toLocaleLowerCase().includes(term),
      ),
      posts: (postsQuery.data?.data.posts ?? []).filter((post) =>
        `${post.title ?? ''} ${post.content}`.toLocaleLowerCase().includes(term),
      ),
    };
  }, [musicQuery.data, postsQuery.data, term, videosQuery.data]);

  const isPending = musicQuery.isPending || videosQuery.isPending || postsQuery.isPending;
  const hasError = musicQuery.isError && videosQuery.isError && postsQuery.isError;
  const count = results.music.length + results.videos.length + results.posts.length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="rounded-[2rem] bg-[#fff3e4] px-6 py-8 shadow-sm ring-1 ring-[#8b4a35]/10 sm:px-10 sm:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b64d60]">Find your next favourite</p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#542c28] sm:text-5xl">Search Makayla&apos;s world</h1>
        <form className="mt-7 flex gap-2 rounded-2xl border border-[#8b4a35]/15 bg-white p-2 shadow-sm" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="site-search" className="sr-only">Search music, videos and updates</label>
          <Search className="ml-3 mt-3 shrink-0 text-[#8b4a35]/60" size={20} aria-hidden="true" />
          <input
            id="site-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try a song, video or story"
            autoComplete="off"
            className="min-h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-[#542c28] outline-none placeholder:text-[#654b44]/45"
          />
        </form>
      </div>

      {term && (
        <section aria-live="polite" className="mt-10">
          {isPending && <p className="text-sm text-[#654b44]/65">Searching the music, videos and updates…</p>}
          {hasError && <p role="alert" className="rounded-2xl bg-white p-5 text-sm text-[#654b44]/70">Search is temporarily unavailable. Please try again soon.</p>}
          {!isPending && !hasError && count === 0 && (
            <div className="rounded-3xl border border-[#8b4a35]/10 bg-white p-7">
              <p className="font-serif text-2xl text-[#542c28]">No matches for “{search.trim()}”</p>
              <p className="mt-2 text-sm text-[#654b44]/65">Try another title or browse the <Link href="/music" className="font-semibold text-[#8d344b] underline underline-offset-4">music</Link> and <Link href="/videos" className="font-semibold text-[#8d344b] underline underline-offset-4">videos</Link>.</p>
            </div>
          )}

          {!isPending && !hasError && count > 0 && (
            <div className="space-y-9">
              {results.music.length > 0 && (
                <ResultSection title="Music">
                  {results.music.map((release) => (
                    <ResultLink key={release.id} href={`/music/${release.id}`} icon={<Disc3 size={18} />} title={release.title} detail={`${release.artistName} · ${release.type}`} />
                  ))}
                </ResultSection>
              )}
              {results.videos.length > 0 && (
                <ResultSection title="Videos">
                  {results.videos.map((video) => (
                    <ResultLink key={video.id} href={`/videos/${video.id}`} icon={<Video size={18} />} title={video.title} detail={video.category} />
                  ))}
                </ResultSection>
              )}
              {results.posts.length > 0 && (
                <ResultSection title="Updates">
                  {results.posts.map((post) => (
                    <ResultLink key={post.id} href={`/posts/${post.id}`} icon={<ArrowUpRight size={18} />} title={post.title || 'Latest update'} detail={post.content.slice(0, 120)} />
                  ))}
                </ResultSection>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-2xl text-[#542c28]">{title}</h2>
      <div className="divide-y divide-[#8b4a35]/10 overflow-hidden rounded-2xl border border-[#8b4a35]/10 bg-white">{children}</div>
    </section>
  );
}

function ResultLink({ href, icon, title, detail }: { href: string; icon: React.ReactNode; title: string; detail: string }) {
  return (
    <Link href={href} className="flex items-start gap-4 p-4 transition-colors hover:bg-[#fff8ef]">
      <span className="mt-0.5 text-[#b64d60]" aria-hidden="true">{icon}</span>
      <span className="min-w-0">
        <span className="block font-semibold text-[#542c28]">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-[#654b44]/65">{detail}</span>
      </span>
      <ArrowUpRight size={16} className="ml-auto mt-1 shrink-0 text-[#8b4a35]/50" aria-hidden="true" />
    </Link>
  );
}
