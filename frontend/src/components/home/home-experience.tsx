'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Disc3, ExternalLink, Newspaper, Video as VideoIcon } from 'lucide-react';

import { Hero } from '@/components/home/hero';
import { SectionHeader } from '@/components/home/section-header';
import { MusicPlatformFallback } from '@/components/music/music-platform-fallback';
import { VideoChannelFallback } from '@/components/videos/video-channel-fallback';
import { useFeaturedMusic, useMusic } from '@/hooks/use-music';
import { usePosts } from '@/hooks/use-posts';
import { useVideos } from '@/hooks/use-videos';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/makaylasuperstar/?hl=en',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/makaylasuperstar/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@MakaylaSuperstar',
  },
  {
    label: 'YouTube Music',
    href: 'https://music.youtube.com/channel/UCNY3D79_l_o0MIAL_sOOcog',
  },
];

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

function SectionError({ children, onRetry }: { children: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-[#ed1689] bg-[#f8f5f7] px-4 py-4 text-sm text-[#222]">
      <p>{children}</p>
      <button type="button" onClick={onRetry} className="min-h-10 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold transition hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]">
        Try again
      </button>
    </div>
  );
}

export function HomeExperience() {
  const postsQuery = usePosts();
  const musicQuery = useMusic();
  const featuredMusicQuery = useFeaturedMusic();
  const videosQuery = useVideos();

  const posts = postsQuery.data?.data.posts.slice(0, 3) ?? [];
  const releases = musicQuery.data?.data.releases ?? [];
  const featuredRelease = featuredMusicQuery.data?.data.release ??
    (!featuredMusicQuery.isPending ? releases[0] : undefined);
  const videos = videosQuery.data?.data.videos.slice(0, 3) ?? [];
  const musicPending = !featuredRelease && (musicQuery.isPending || featuredMusicQuery.isPending);
  const musicUnavailable = !featuredRelease && (musicQuery.isError || featuredMusicQuery.isError);

  return (
    <div className="bg-white text-[#111]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Hero latestVideoHref={videos[0] ? `/videos/${videos[0].id}` : undefined} />

        <section id="latest-updates" className="scroll-mt-28 border-t border-black/10 pt-14 sm:pt-20">
          <SectionHeader eyebrow="The latest" title="Notes from Makayla" tone="brand" />
          {postsQuery.isPending && (
            <div className="grid gap-x-6 gap-y-8 md:grid-cols-3" aria-label="Loading updates" aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div key={item} className="aspect-[4/3] animate-pulse bg-black/5" />
              ))}
            </div>
          )}
          {postsQuery.isError && (
            <SectionError onRetry={() => { void postsQuery.refetch(); }}>Latest updates are temporarily unavailable.</SectionError>
          )}
          {!postsQuery.isPending && !postsQuery.isError && posts.length === 0 && (
            <div className="border-y border-black/10 py-8">
              <p className="font-medium">No updates have been published yet.</p>
              <p className="mt-2 text-sm text-black/55">Check back for news and announcements from Makayla.</p>
            </div>
          )}
          {!postsQuery.isPending && !postsQuery.isError && posts.length > 0 && (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group flex h-full flex-col">
                  <Link
                    href={`/posts/${post.id}`}
                    aria-label={`Read ${post.title || 'Makayla’s latest update'}`}
                    className="relative mb-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-[#f0edf0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]"
                  >
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Newspaper size={32} strokeWidth={1.2} className="text-[#ed1689]" aria-hidden="true" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <time dateTime={post.publishedAt ?? post.createdAt} className="text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                      {dateLabel(post.publishedAt ?? post.createdAt)}
                    </time>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.025em]">
                      <Link href={`/posts/${post.id}`} className="transition-colors hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]">
                        {post.title || 'Latest update'}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/65">{post.content}</p>
                    <Link href={`/posts/${post.id}`} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#111] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
                      Read update <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-black/10 pt-14 sm:pt-20">
          <SectionHeader eyebrow="Listen" title="Music by Makayla" href="/music" tone="brand" />
          {musicPending && <div className="h-64 animate-pulse bg-black/5" aria-label="Loading music" aria-busy="true" />}
          {musicUnavailable && (
            <>
              <SectionError onRetry={() => { void Promise.all([musicQuery.refetch(), featuredMusicQuery.refetch()]); }}>The music spotlight is temporarily unavailable.</SectionError>
              <div className="mt-5"><MusicPlatformFallback unavailable brand /></div>
            </>
          )}
          {!musicPending && !musicUnavailable && !featuredRelease && (
            <MusicPlatformFallback brand />
          )}
          {!musicPending && !musicUnavailable && featuredRelease && (
            <div className="grid overflow-hidden rounded-2xl bg-[#0b0b0d] text-white md:grid-cols-[minmax(240px,0.8fr)_1.2fr]">
              <Link href={`/music/${featuredRelease.id}`} aria-label={`View ${featuredRelease.title} release details`} className="relative block aspect-square bg-[#19171a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ed1689]">
                {featuredRelease.coverUrl ? (
                  <Image
                    src={featuredRelease.coverUrl}
                    alt={`${featuredRelease.title} cover artwork`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-opacity hover:opacity-90"
                  />
                ) : (
                  <div className="grid size-full place-items-center" aria-label="No release artwork">
                    <Disc3 size={60} strokeWidth={1} className="text-[#ed1689]" aria-hidden="true" />
                  </div>
                )}
              </Link>
              <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff71bb]">
                    {featuredRelease.isFeatured ? 'Featured release' : 'Latest release'} · {featuredRelease.type}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                    <Link href={`/music/${featuredRelease.id}`} className="font-serif hover:text-[#ff71bb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff71bb]">
                      {featuredRelease.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-white/75">{featuredRelease.artistName}</p>
                  <time dateTime={featuredRelease.releaseDate} className="mt-4 block text-sm text-white/60">{dateLabel(featuredRelease.releaseDate)}</time>
                  {featuredRelease.description && <p className="mt-5 max-w-xl text-sm leading-6 text-white/70">{featuredRelease.description}</p>}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {featuredRelease.links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#ff71bb] hover:text-[#ff71bb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff71bb]">
                      Listen on {link.platform} <ExternalLink size={14} />
                    </a>
                  ))}
                  <Link href={`/music/${featuredRelease.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ed1689] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff71bb]">
                    Release details <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="border-t border-black/10 pt-14 sm:pt-20">
          <SectionHeader eyebrow="Watch" title="Latest videos" href="/videos" tone="brand" />
          {videosQuery.isPending && (
            <div className="grid gap-6 md:grid-cols-3" aria-label="Loading videos" aria-busy="true">
              {[0, 1, 2].map((item) => <div key={item} className="aspect-video animate-pulse rounded-xl bg-black/5" />)}
            </div>
          )}
          {videosQuery.isError && (
            <>
              <SectionError onRetry={() => { void videosQuery.refetch(); }}>Videos are temporarily unavailable.</SectionError>
              <div className="mt-5"><VideoChannelFallback unavailable brand /></div>
            </>
          )}
          {!videosQuery.isPending && !videosQuery.isError && videos.length === 0 && (
            <VideoChannelFallback brand />
          )}
          {!videosQuery.isPending && !videosQuery.isError && videos.length > 0 && (
            <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`} aria-label={`Watch ${video.title}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-[#111]">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={`Thumbnail for ${video.title}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid size-full place-items-center"><VideoIcon size={32} className="text-white/60" aria-hidden="true" /></div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/85 px-3 py-1 text-xs font-semibold text-white">{video.category}</span>
                  </div>
                  <h3 className="mt-4 font-semibold leading-snug tracking-[-0.02em] group-hover:text-[#c30c6c]">{video.title}</h3>
                  {video.publishedAt && <time dateTime={video.publishedAt} className="mt-2 block text-xs text-black/55">{dateLabel(video.publishedAt)}</time>}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-14 border-t border-black/10 py-10 sm:mt-20 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c30c6c]">Stay connected</p>
              <h2 className="mt-2 font-serif text-2xl font-medium tracking-[-0.035em] text-[#111] sm:text-3xl">Come be part of the fun.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]">
                  {link.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
