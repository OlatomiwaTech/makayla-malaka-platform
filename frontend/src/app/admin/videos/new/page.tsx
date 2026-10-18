'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '@/lib/api';

import { z } from 'zod';

const formSchema = z.object({
  youtubeUrl: z
    .string()
    .trim()
    .url('Enter a valid YouTube URL'),

  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150),

  description: z
    .string()
    .max(5000)
    .optional(),

  seoTitle: z.string().trim().max(70, 'SEO titles must be 70 characters or fewer'),

  seoDescription: z.string().trim().max(320, 'SEO descriptions must be 320 characters or fewer'),

  thumbnailUrl: z
    .string()
    .trim()
    .url('Enter a valid thumbnail URL')
    .optional()
    .or(z.literal('')),

  category: z
    .string()
    .trim()
    .min(1, 'Category is required')
    .max(50),

  status: z.enum([
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED',
  ]),
});

type FormData = z.infer<
  typeof formSchema
>;

type VideoPreview = {
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  channelTitle: string | null;
  sourcePublishedAt: string | null;
  durationSeconds: number | null;
  categoryId: string | null;
  metadataSource: 'youtube-data-api' | 'youtube-oembed';
};

type PreviewResponse = {
  success: boolean;
  data: { video: VideoPreview };
};

const formatDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export default function NewVideoPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedUrl = useRef<string | null>(null);
  const previewRequestId = useRef(0);
  const lastAutoTitle = useRef<string | null>(null);
  const lastAutoDescription = useRef<string | null>(null);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver:
      zodResolver(formSchema),

    defaultValues: {
      status: 'DRAFT',
      thumbnailUrl: '',
      seoTitle: '',
      seoDescription: '',
    },
  });
  const youtubeUrlField = register('youtubeUrl');
  const seoTitleField = register('seoTitle');
  const seoDescriptionField = register('seoDescription');
  const seoTitle = useWatch({ control, name: 'seoTitle' });
  const seoDescription = useWatch({ control, name: 'seoDescription' });
  const title = useWatch({ control, name: 'title' });
  const description = useWatch({ control, name: 'description' });

  const analyzeUrl = async () => {
    const youtubeUrl = getValues('youtubeUrl').trim();
    if (!youtubeUrl) return;
    if (lastAnalyzedUrl.current === youtubeUrl && preview) return;

    setIsAnalyzing(true);
    setPreviewError(null);
    setPreview(null);
    setServerError(null);
    const requestId = ++previewRequestId.current;

    try {
      const result = await api<PreviewResponse>(
        `/videos/preview?url=${encodeURIComponent(youtubeUrl)}`,
      );
      if (requestId !== previewRequestId.current) return;

      const metadata = result.data.video;
      const currentTitle = getValues('title').trim();
      const currentDescription = getValues('description')?.trim() ?? '';

      if (!currentTitle || currentTitle === lastAutoTitle.current) {
        setValue('title', metadata.title, { shouldValidate: true });
        lastAutoTitle.current = metadata.title;
      }
      if (!currentDescription || currentDescription === lastAutoDescription.current) {
        setValue('description', metadata.description ?? '', { shouldValidate: true });
        lastAutoDescription.current = metadata.description;
      }
      setValue('thumbnailUrl', metadata.thumbnailUrl, { shouldValidate: true });
      lastAnalyzedUrl.current = youtubeUrl;
      setPreview(metadata);
    } catch (error) {
      if (requestId !== previewRequestId.current) return;

      lastAnalyzedUrl.current = null;
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Could not analyze this YouTube video.';
      setPreviewError(message);
    } finally {
      if (requestId === previewRequestId.current) {
        setIsAnalyzing(false);
      }
    }
  };

  const onSubmit = async (
    data: FormData,
  ) => {
    try {
      setServerError(null);

      await api('/videos', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          thumbnailUrl: data.thumbnailUrl || undefined,
        }),
      });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      const status =
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof error.status === 'number'
          ? error.status
          : undefined;
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ? error.message
            : 'Failed to add video';

      setServerError(
        status === 401
          ? 'Please sign in with a content manager, editor, or admin account before adding a video.'
          : status === 403
            ? 'Your account is not authorized to manage videos.'
            : message,
      );
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Link href="/admin" className="text-sm font-medium text-black/55 transition hover:text-black">
          Back to content studio
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          Add YouTube video
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50">
          Add a video from Makayla&apos;s YouTube
          channel to the platform.
        </p>
        <a
          href="https://www.youtube.com/@MakaylaSuperstar"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4"
        >
          Open Makayla&apos;s official YouTube channel
        </a>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-[30px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label className="text-sm font-medium">
            YouTube URL
          </label>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              {...youtubeUrlField}
              onBlur={(event) => {
                youtubeUrlField.onBlur(event);
                void analyzeUrl();
              }}
              onPaste={() => {
                window.setTimeout(() => void analyzeUrl(), 0);
              }}
              placeholder="Paste a YouTube video URL"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
              aria-describedby="youtube-url-help"
            />
            <button
              type="button"
              onClick={() => void analyzeUrl()}
              disabled={isAnalyzing}
              className="shrink-0 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04] disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze video'}
            </button>
          </div>
          <p id="youtube-url-help" className="mt-2 text-xs text-black/45">
            Paste a public YouTube video link. We&apos;ll fill in its title, description, and thumbnail.
          </p>

          {errors.youtubeUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.youtubeUrl.message}
            </p>
          )}
        </div>

        {preview && (
          <section aria-live="polite" className="overflow-hidden rounded-2xl border border-green-200 bg-green-50">
            <div className="grid sm:grid-cols-[220px_1fr]">
              <img
                src={preview.thumbnailUrl}
                alt={`Thumbnail for ${preview.title}`}
                className="aspect-video h-full w-full object-cover"
              />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-800">
                  YouTube video recognized
                </p>
                <h2 className="mt-2 font-semibold">{preview.title}</h2>
                <p className="mt-1 text-sm text-black/55">
                  {preview.channelTitle ?? 'Unknown channel'}
                  {preview.durationSeconds !== null && ` · ${formatDuration(preview.durationSeconds)}`}
                </p>
                <p className="mt-2 text-sm text-black/55">
                  {preview.sourcePublishedAt
                    ? `Published on YouTube ${new Date(preview.sourcePublishedAt).toLocaleDateString()}`
                    : 'YouTube publish date and duration require a YouTube Data API key.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {previewError && (
          <div role="alert" className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Could not fetch YouTube metadata: {previewError}
          </div>
        )}

        <div>
          <label className="text-sm font-medium">
            Title
          </label>

          <input
            {...register('title')}
            placeholder="Video title"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <section className="space-y-4 rounded-2xl border border-black/[0.07] p-4">
          <div>
            <h2 className="font-semibold">Search and social preview</h2>
            <p className="mt-1 text-sm text-black/50">Optional overrides for search results and link previews. Leave blank to generate them from the video title and description.</p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="seoTitle" className="text-sm font-medium">SEO title</label>
              <span className="text-xs text-black/40">{seoTitle.length}/70</span>
            </div>
            <input {...seoTitleField} id="seoTitle" maxLength={70} placeholder="Defaults to the video title" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            {errors.seoTitle && <p className="mt-2 text-sm text-red-600">{errors.seoTitle.message}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="seoDescription" className="text-sm font-medium">SEO description</label>
              <span className="text-xs text-black/40">{seoDescription.length}/320</span>
            </div>
            <textarea {...seoDescriptionField} id="seoDescription" maxLength={320} rows={3} placeholder="Summarize the video for search and social previews" className="mt-2 w-full resize-y rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            {errors.seoDescription && <p className="mt-2 text-sm text-red-600">{errors.seoDescription.message}</p>}
          </div>
          <div className="rounded-xl bg-[#f7f5f1] p-4">
            <p className="text-xs text-[#1a5dab]">{seoTitle || `${title || 'Video title'} | Makayla Malaka`}</p>
            <p className="mt-1 text-xs text-green-800">Your website › videos › video</p>
            <p className="mt-1 text-sm text-black/60">{seoDescription || description || 'Video description will appear in the search and social preview.'}</p>
          </div>
        </section>

        <div>
          <label className="text-sm font-medium">
            Category
          </label>

          <select
            {...register('category')}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          >
            <option value="">
              Select category
            </option>

            <option value="Music Videos">
              Music Videos
            </option>

            <option value="REFIXES">
              REFIXES
            </option>

            <option value="Performances">
              Performances
            </option>

            <option value="Interviews">
              Interviews
            </option>

            <option value="Behind the Scenes">
              Behind the Scenes
            </option>
          </select>

          {errors.category && (
            <p className="mt-2 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            {...register('description')}
            rows={5}
            placeholder="Describe the video..."
            className="mt-2 w-full resize-none rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Thumbnail URL
          </label>
          <input
            {...register('thumbnailUrl')}
            type="url"
            placeholder="Automatically filled from YouTube"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />
          {errors.thumbnailUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.thumbnailUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Status
          </label>

          <select
            {...register('status')}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3"
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="PUBLISHED">
              Published
            </option>
          </select>
        </div>

        {serverError && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {serverError}
            {(serverError.includes('sign in') || serverError.includes('authorized')) && (
              <Link href="/admin/login" className="ml-2 font-semibold underline underline-offset-2">
                Sign in
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Adding video...'
            : 'Add video'}
        </button>
      </form>
    </main>
  );
}
