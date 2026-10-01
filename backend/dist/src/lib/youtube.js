const YOUTUBE_VIDEO_ID_LENGTH = 11;
export const extractYouTubeVideoId = (value) => {
    try {
        const url = new URL(value);
        const hostname = url.hostname
            .toLowerCase()
            .replace(/^www\./, '');
        let videoId = null;
        if (hostname === 'youtu.be') {
            videoId = url.pathname.slice(1);
        }
        if (hostname === 'youtube.com') {
            if (url.pathname === '/watch') {
                videoId = url.searchParams.get('v');
            }
            else if (url.pathname.startsWith('/shorts/')) {
                videoId = url.pathname.split('/')[2] ?? null;
            }
            else if (url.pathname.startsWith('/embed/')) {
                videoId = url.pathname.split('/')[2] ?? null;
            }
        }
        if (!videoId ||
            videoId.length !== YOUTUBE_VIDEO_ID_LENGTH ||
            !/^[a-zA-Z0-9_-]+$/.test(videoId)) {
            return null;
        }
        return videoId;
    }
    catch {
        return null;
    }
};
export const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
};
export const getYouTubeThumbnailUrl = (videoId) => {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};
//# sourceMappingURL=youtube.js.map