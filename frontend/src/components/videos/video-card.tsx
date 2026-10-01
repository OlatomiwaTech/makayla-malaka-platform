import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

import type { Video } from '@/types/video';

type VideoCardProps = {
  video: Video;
};

export function VideoCard({
  video,
}: VideoCardProps) {
  return (
    <Link
      href={`/videos/${video.id}`}
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden rounded-[26px] bg-[#1a1a1a]">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid size-14 place-items-center rounded-full bg-white text-black">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {video.category}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold tracking-[-0.02em]">
            {video.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-black/45">
            {video.description ?? 'Watch now.'}
          </p>
        </div>

        <ArrowUpRight
          size={17}
          className="mt-1 shrink-0 text-black/30"
        />
      </div>
    </Link>
  );
}
