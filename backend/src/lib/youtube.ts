const YOUTUBE_VIDEO_ID_LENGTH = 11;

export const extractYouTubeVideoId = (
  value: string,
): string | null => {
  try {
    const url = new URL(value);

    const hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, '');

    let videoId: string | null = null;

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1);
    }

    if (hostname === 'youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2] ?? null;
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2] ?? null;
      }
    }

    if (
      !videoId ||
      videoId.length !== YOUTUBE_VIDEO_ID_LENGTH ||
      !/^[a-zA-Z0-9_-]+$/.test(videoId)
    ) {
      return null;
    }

    return videoId;
  } catch {
    return null;
  }
};

export const getYouTubeEmbedUrl = (
  videoId: string,
) => {
  return `https://www.youtube.com/embed/${videoId}`;
};

export const getYouTubeThumbnailUrl = (
  videoId: string,
) => {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};
