'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Disc3, ExternalLink, Newspaper, Video as VideoIcon } from 'lucide-react';

import { Hero } from '@/components/home/hero';
import { SectionHeader } from '@/components/home/section-header';
import { useMusic } from '@/hooks/use-music';
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
  }).format(new Date(value));

function SectionError({ children }: { children: string }) {
  return (
    <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
      {children}
    </p>
  );
}

export function HomeExperience() {
  const postsQuery = usePosts();
  const musicQuery = useMusic();
  const videosQuery = useVideos();

  const posts = postsQuery.data?.data.posts.slice(0, 3) ?? [];
  const releases = musicQuery.data?.data.releases ?? [];
  const featuredRelease = releases.find((release) => release.isFeatured) ?? releases[0];
  const videos = videosQuery.data?.data.videos.slice(0, 3) ?? [];

  return (
    <div className="bg-[#fffaf3]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Hero latestVideoHref={videos[0] ? `/videos/${videos[0].id}` : undefined} />

        <section aria-label="Makayla at a glance" className="mt-5 grid grid-cols-3 divide-x divide-[#8b4a35]/15 rounded-2xl border border-[#8b4a35]/10 bg-white/70 px-2 py-5 shadow-sm sm:mt-7 sm:px-8 sm:py-6">
          <div className="px-2 text-center sm:px-4"><p className="font-serif text-2xl text-[#8d344b] sm:text-3xl">6</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#654b44]/65 sm:text-[10px] sm:tracking-[0.18em]">Albums</p></div>
          <div className="px-2 text-center sm:px-4"><p className="font-serif text-2xl text-[#8d344b] sm:text-3xl">7</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#654b44]/65 sm:text-[10px] sm:tracking-[0.18em]">First single at</p></div>
          <div className="px-2 text-center sm:px-4"><p className="font-serif text-2xl text-[#8d344b] sm:text-3xl">∞</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#654b44]/65 sm:text-[10px] sm:tracking-[0.18em]">Big dreams</p></div>
        </section>

        <section id="latest-updates" className="scroll-mt-28 pt-16 sm:pt-20">
          <SectionHeader eyebrow="The latest" title="Notes from Makayla" />
          {postsQuery.isPending && (
            <div className="grid gap-5 md:grid-cols-3" aria-label="Loading updates">
              {[0, 1, 2].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-3xl bg-[#f4e9dc]" />
              ))}
            </div>
          )}
          {postsQuery.isError && (
            <SectionError>Latest updates are temporarily unavailable. Please try again soon.</SectionError>
          )}
          {!postsQuery.isPending && !postsQuery.isError && posts.length === 0 && (
            <div className="border-y border-black/10 py-9">
              <p className="font-medium">No updates have been published yet.</p>
              <p className="mt-2 text-sm text-black/55">Check back for news and announcements from Makayla.</p>
            </div>
          )}
          {!postsQuery.isPending && !postsQuery.isError && posts.length > 0 && (
            <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group flex h-full flex-col rounded-3xl border border-[#8b4a35]/10 bg-white p-3 shadow-[0_12px_40px_-32px_rgba(84,44,40,0.5)] transition hover:-translate-y-1">
                  <Link
                    href={`/posts/${post.id}`}
                    aria-label={`Read ${post.title || 'Makayla’s latest update'}`}
                    className="relative mb-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-[#f4e9dc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]"
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
                  <div className="flex flex-1 flex-col px-2 pb-2">
                    <time dateTime={post.publishedAt ?? post.createdAt} className="text-xs font-medium uppercase tracking-[0.14em] text-black/45">
                      {dateLabel(post.publishedAt ?? post.createdAt)}
                    </time>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.025em]">
                      <Link href={`/posts/${post.id}`} className="transition-colors hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]">
                        {post.title || 'Latest update'}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60">{post.content}</p>
                    <Link href={`/posts/${post.id}`} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
                      Read update <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="pt-16 sm:pt-20">
          <SectionHeader eyebrow="Listen" title="Music by Makayla" href="/music" />
          {musicQuery.isPending && <div className="h-64 animate-pulse rounded-3xl bg-[#f4e9dc]" aria-label="Loading music" />}
          {musicQuery.isError && <SectionError>The music catalogue is temporarily unavailable. Please try again soon.</SectionError>}
          {!musicQuery.isPending && !musicQuery.isError && !featuredRelease && (
            <div className="flex flex-col items-start gap-4 border-y border-black/10 py-9 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">No music releases have been published yet.</p>
                <p className="mt-2 text-sm text-black/55">Visit the catalogue to check back for new music.</p>
              </div>
              <Link href="/music" className="inline-flex min-h-11 items-center gap-2 bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
                Explore music <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
          {!musicQuery.isPending && !musicQuery.isError && featuredRelease && (
            <div className="grid overflow-hidden rounded-3xl bg-[#633644] text-white shadow-[0_24px_70px_-40px_rgba(84,44,40,0.65)] md:grid-cols-[minmax(240px,0.8fr)_1.2fr]">
              <Link href={`/music/${featuredRelease.id}`} className="relative block aspect-square bg-[#e9c1a6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ed1689]">
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
                    <Disc3 size={60} strokeWidth={1} className="text-white/45" aria-hidden="true" />
                  </div>
                )}
              </Link>
              <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd18a]">
                    {featuredRelease.isFeatured ? 'Featured release' : 'Latest release'} · {featuredRelease.type}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                    <Link href={`/music/${featuredRelease.id}`} className="font-serif hover:text-[#ffd18a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd18a]">
                      {featuredRelease.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-white/65">{featuredRelease.artistName}</p>
                  <p className="mt-4 text-sm text-white/50">{dateLabel(featuredRelease.releaseDate)}</p>
                  {featuredRelease.description && <p className="mt-5 max-w-xl text-sm leading-6 text-white/65">{featuredRelease.description}</p>}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {featuredRelease.links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-white/30 px-4 py-2 text-sm font-semibold transition-colors hover:border-[#ff71bb] hover:text-[#ff71bb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff71bb]">
                      Listen on {link.platform} <ExternalLink size={14} />
                    </a>
                  ))}
                  <Link href={`/music/${featuredRelease.id}`} className="inline-flex min-h-11 items-center gap-2 bg-[#ed1689] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff71bb]">
                    Release details <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="pt-16 sm:pt-20">
          <SectionHeader eyebrow="Watch" title="Latest videos" href="/videos" />
          {videosQuery.isPending && (
            <div className="grid gap-6 md:grid-cols-3" aria-label="Loading videos">
            {[0, 1, 2].map((item) => <div key={item} className="aspect-video animate-pulse rounded-2xl bg-[#f4e9dc]" />)}
            </div>
          )}
          {videosQuery.isError && <SectionError>Videos are temporarily unavailable. Please try again soon.</SectionError>}
          {!videosQuery.isPending && !videosQuery.isError && videos.length === 0 && (
            <div className="border-y border-black/10 py-9">
              <p className="font-medium">No videos have been published yet.</p>
              <p className="mt-2 text-sm text-black/55">New videos will appear here when available.</p>
            </div>
          )}
          {!videosQuery.isPending && !videosQuery.isError && videos.length > 0 && (
            <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ed1689]">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#633644]">
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
                    <span className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-xs font-semibold text-white">{video.category}</span>
                  </div>
                  <h3 className="mt-4 font-semibold leading-snug tracking-[-0.02em] group-hover:text-[#c30c6c]">{video.title}</h3>
                  {video.publishedAt && <time dateTime={video.publishedAt} className="mt-2 block text-xs text-black/45">{dateLabel(video.publishedAt)}</time>}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 rounded-3xl bg-[#f3dfce] px-6 py-8 sm:mt-20 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8d344b]">Stay connected</p>
              <h2 className="mt-2 font-serif text-2xl font-medium tracking-[-0.035em] text-[#542c28] sm:text-3xl">Come be part of the fun.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-black/15 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-[#ed1689] hover:text-[#c30c6c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1689]">
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
