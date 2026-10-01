'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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

export default function NewVideoPage() {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
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
    },
  });

  const onSubmit = async (
    data: FormData,
  ) => {
    try {
      setServerError(null);

      await api('/videos', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      router.push('/admin/videos');
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ? error.message
            : 'Failed to add video';

      setServerError(message);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          Add YouTube video
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50">
          Add a video from Makayla's YouTube
          channel to the platform.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-[30px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label className="text-sm font-medium">
            YouTube URL
          </label>

          <input
            {...register('youtubeUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-black"
          />

          {errors.youtubeUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.youtubeUrl.message}
            </p>
          )}
        </div>

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
