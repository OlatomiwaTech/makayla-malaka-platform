type YouTubePlayerProps = {
  videoId: string;
  title: string;
};

export function YouTubePlayer({
  videoId,
  title,
}: YouTubePlayerProps) {
  return (
    <div className="aspect-video overflow-hidden rounded-[30px] bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
