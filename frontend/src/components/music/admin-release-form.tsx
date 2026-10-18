'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { api } from '@/lib/api';
import type { MusicRelease } from '@/types/music';

const optionalUrlSchema = z.string().trim().url('Enter a valid URL').or(z.literal(''));
const trackSchema = z.object({
  title: z.string().trim().min(1, 'Track title is required').max(150),
  trackNumber: z.number().int().positive(),
  durationSeconds: z.number().int().positive().optional(),
  previewUrl: optionalUrlSchema,
});
const linkSchema = z.object({
  platform: z.string().trim().min(1, 'Platform is required').max(40),
  url: z.string().trim().url('Enter a valid listening link'),
});
const formSchema = z.object({
  title: z.string().trim().min(1, 'Release title is required').max(150),
  artistName: z.string().trim().min(1, 'Artist is required').max(150),
  description: z.string().trim().max(5000),
  coverUrl: optionalUrlSchema,
  releaseDate: z.string().min(1, 'Release date is required').refine(
    (value) => !Number.isNaN(Date.parse(value)),
    'Enter a valid release date and time',
  ),
  type: z.enum(['SINGLE', 'EP', 'ALBUM']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  isFeatured: z.boolean(),
  tracks: z.array(trackSchema).min(1, 'Add at least one track'),
  links: z.array(linkSchema),
});

type FormData = z.infer<typeof formSchema>;
type SaveReleaseResponse = {
  data: { release: MusicRelease };
};

const initialValues: FormData = {
  title: '',
  artistName: 'Makayla Malaka',
  description: '',
  coverUrl: '',
  releaseDate: '',
  type: 'SINGLE',
  status: 'DRAFT',
  isFeatured: false,
  tracks: [{ title: '', trackNumber: 1, durationSeconds: undefined, previewUrl: '' }],
  links: [],
};

const inputClass =
  'mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black';

const toLocalDateTime = (value: string) => {
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

const toFormValues = (release: MusicRelease): FormData => ({
  title: release.title,
  artistName: release.artistName,
  description: release.description ?? '',
  coverUrl: release.coverUrl ?? '',
  releaseDate: toLocalDateTime(release.releaseDate),
  type: release.type,
  status: release.status,
  isFeatured: release.isFeatured,
  tracks: release.tracks.map((track) => ({
    title: track.title,
    trackNumber: track.trackNumber,
    durationSeconds: track.durationSeconds ?? undefined,
    previewUrl: track.previewUrl ?? '',
  })),
  links: release.links.map((link) => ({
    platform: link.platform,
    url: link.url,
  })),
});

export function AdminMusicReleaseForm({
  release,
}: {
  release?: MusicRelease;
}) {
  const router = useRouter();
  const isEditing = Boolean(release);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [artworkMessage, setArtworkMessage] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: release ? toFormValues(release) : initialValues,
  });
  const {
    fields: trackFields,
    append: addTrack,
    remove: removeTrack,
  } = useFieldArray({ control, name: 'tracks' });
  const {
    fields: linkFields,
    append: addLink,
    remove: removeLink,
  } = useFieldArray({ control, name: 'links' });
  const title = useWatch({ control, name: 'title' });
  const artistName = useWatch({ control, name: 'artistName' });
  const coverUrl = useWatch({ control, name: 'coverUrl' });
  const releaseDate = useWatch({ control, name: 'releaseDate' });
  const tracks = useWatch({ control, name: 'tracks' });
  const links = useWatch({ control, name: 'links' });
  const status = useWatch({ control, name: 'status' });
  const releaseType = useWatch({ control, name: 'type' });

  const onSubmit = async (formData: FormData) => {
    setServerError(null);
    setSuccessMessage(null);

    const payload = {
      ...formData,
      releaseDate: new Date(formData.releaseDate).toISOString(),
      description: formData.description || undefined,
      coverUrl: formData.coverUrl || undefined,
      tracks: formData.tracks.map((track) => ({
        ...track,
        durationSeconds: track.durationSeconds || undefined,
        previewUrl: track.previewUrl || undefined,
      })),
    };

    try {
      const result = await api<SaveReleaseResponse>(
        isEditing ? `/music/${release?.id}` : '/music',
        {
          method: isEditing ? 'PATCH' : 'POST',
          body: JSON.stringify(payload),
        },
      );
      setSuccessMessage(`“${result.data.release.title}” was saved successfully.`);
      if (isEditing) {
        router.push('/admin/music');
      } else {
        reset(initialValues);
      }
    } catch (error) {
      const statusCode =
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        typeof error.status === 'number'
          ? error.status
          : undefined;
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to save this release. Please try again.';
      setServerError(
        statusCode === 401
          ? 'Please sign in with a content manager, editor, or admin account before managing releases.'
          : statusCode === 403
            ? 'Your account is not authorized to manage releases.'
            : message,
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin/music" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition hover:text-black">
        <ArrowLeft size={16} />
        Music releases
      </Link>

      <div className="mb-8 mt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Music catalogue
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          {isEditing ? 'Edit release' : 'Add a release'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
          Create a single, EP, or album with artwork, tracks, and listening links. Save drafts to finish later, preview the catalogue card, and publish now or schedule it for a future date.
        </p>
        <a
          href="https://music.youtube.com/channel/UCNY3D79_l_o0MIAL_sOOcog"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4"
        >
          Open Makayla&apos;s YouTube Music catalogue
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-[30px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
        <section className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="text-sm font-medium">Release title</label>
            <input {...register('title')} id="title" className={inputClass} placeholder="Release title" />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="artistName" className="text-sm font-medium">Artist</label>
            <input {...register('artistName')} id="artistName" className={inputClass} placeholder="Artist or collaborator" />
            {errors.artistName && <p className="mt-2 text-sm text-red-600">{errors.artistName.message}</p>}
          </div>

          <div>
            <label htmlFor="type" className="text-sm font-medium">Release type</label>
            <select {...register('type')} id="type" className={inputClass}>
              <option value="SINGLE">Single</option>
              <option value="EP">EP</option>
              <option value="ALBUM">Album</option>
            </select>
          </div>

          <div>
            <label htmlFor="releaseDate" className="text-sm font-medium">Release date and time</label>
            <input {...register('releaseDate')} id="releaseDate" type="datetime-local" className={inputClass} />
            {errors.releaseDate && <p className="mt-2 text-sm text-red-600">{errors.releaseDate.message}</p>}
            <p className="mt-2 text-xs text-black/45">Scheduled releases appear publicly at this time.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="coverUrl" className="text-sm font-medium">Cover artwork URL <span className="text-black/40">(optional)</span></label>
            <input {...register('coverUrl')} id="coverUrl" type="url" className={inputClass} placeholder="https://..." onChange={(event) => { register('coverUrl').onChange(event); setArtworkMessage(null); }} />
            {errors.coverUrl && <p className="mt-2 text-sm text-red-600">{errors.coverUrl.message}</p>}
            {coverUrl && (
              <div className="mt-4 flex items-start gap-4 rounded-2xl bg-[#f7f5f1] p-4">
                <img
                  src={coverUrl}
                  alt="Artwork preview"
                  className="size-24 rounded-xl object-cover"
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    let supportedType = false;
                    try {
                      const urlPath = new URL(coverUrl).pathname.toLowerCase();
                      supportedType = /\.(jpe?g|png|webp|avif)$/.test(urlPath);
                    } catch {
                      supportedType = false;
                    }
                    const issues = [];
                    if (naturalWidth !== naturalHeight) issues.push('artwork should be square');
                    if (naturalWidth < 1000 || naturalHeight < 1000) issues.push('artwork should be at least 1000 × 1000 pixels');
                    if (!supportedType) issues.push('use a direct JPEG, PNG, WebP, or AVIF image URL');
                    setArtworkMessage(
                      issues.length
                        ? `Check the artwork: ${issues.join('; ')}.`
                        : `Artwork looks good (${naturalWidth} × ${naturalHeight}).`,
                    );
                  }}
                  onError={() => setArtworkMessage('The artwork URL could not be loaded. Check that it points to a public image.')}
                />
                <p role="status" className="pt-2 text-sm text-black/60">
                  {artworkMessage ?? 'Checking artwork dimensions and image format…'}
                </p>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">Description <span className="text-black/40">(optional)</span></label>
            <textarea {...register('description')} id="description" rows={4} className={`${inputClass} resize-y`} placeholder="About this release..." />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
          </div>
        </section>

        <section className="border-t border-black/[0.07] pt-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Tracks</h2>
              <p className="mt-1 text-sm text-black/45">Add each track in its catalogue order.</p>
            </div>
            <button
              type="button"
              onClick={() => addTrack({ title: '', trackNumber: trackFields.length + 1, durationSeconds: undefined, previewUrl: '' })}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              <Plus size={16} /> Add track
            </button>
          </div>
          <div className="space-y-4">
            {trackFields.map((field, index) => (
              <div key={field.id} className="rounded-2xl bg-[#f7f5f1] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Track {index + 1}</p>
                  {trackFields.length > 1 && (
                    <button type="button" onClick={() => removeTrack(index)} aria-label={`Remove track ${index + 1}`} className="rounded-full p-2 text-black/45 hover:bg-white hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label htmlFor={`tracks.${index}.title`} className="text-xs font-medium text-black/60">Track title</label>
                    <input {...register(`tracks.${index}.title`)} id={`tracks.${index}.title`} className={inputClass} placeholder="Track title" />
                    {errors.tracks?.[index]?.title && <p className="mt-2 text-sm text-red-600">{errors.tracks[index]?.title?.message}</p>}
                  </div>
                  <div>
                    <label htmlFor={`tracks.${index}.trackNumber`} className="text-xs font-medium text-black/60">Track number</label>
                    <input {...register(`tracks.${index}.trackNumber`, { valueAsNumber: true })} id={`tracks.${index}.trackNumber`} type="number" min="1" className={inputClass} />
                    {errors.tracks?.[index]?.trackNumber && <p className="mt-2 text-sm text-red-600">Enter a valid track number.</p>}
                  </div>
                  <div>
                    <label htmlFor={`tracks.${index}.durationSeconds`} className="text-xs font-medium text-black/60">Duration in seconds <span className="text-black/40">(optional)</span></label>
                    <input {...register(`tracks.${index}.durationSeconds`, { setValueAs: (value) => value === '' ? undefined : Number(value) })} id={`tracks.${index}.durationSeconds`} type="number" min="1" className={inputClass} placeholder="e.g. 184" />
                    {errors.tracks?.[index]?.durationSeconds && <p className="mt-2 text-sm text-red-600">Enter a valid duration.</p>}
                  </div>
                  <div>
                    <label htmlFor={`tracks.${index}.previewUrl`} className="text-xs font-medium text-black/60">Preview URL <span className="text-black/40">(optional)</span></label>
                    <input {...register(`tracks.${index}.previewUrl`)} id={`tracks.${index}.previewUrl`} type="url" className={inputClass} placeholder="https://..." />
                    {errors.tracks?.[index]?.previewUrl && <p className="mt-2 text-sm text-red-600">{errors.tracks[index]?.previewUrl?.message}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.tracks?.root && <p className="mt-3 text-sm text-red-600">{errors.tracks.root.message}</p>}
        </section>

        <section className="border-t border-black/[0.07] pt-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">Listening links</h2>
              <p className="mt-1 text-sm text-black/45">Add the release on Spotify, Apple Music, YouTube Music, and other platforms.</p>
            </div>
            <button
              type="button"
              onClick={() => addLink({ platform: '', url: '' })}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              <Plus size={16} /> Add link
            </button>
          </div>
          {linkFields.length === 0 && <p className="rounded-2xl bg-[#f7f5f1] p-4 text-sm text-black/50">No listening links added. You can add them now or later.</p>}
          <div className="space-y-4">
            {linkFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl bg-[#f7f5f1] p-4 sm:grid-cols-[0.7fr_1.3fr_auto] sm:items-end">
                <div>
                  <label htmlFor={`links.${index}.platform`} className="text-xs font-medium text-black/60">Platform</label>
                  <input {...register(`links.${index}.platform`)} id={`links.${index}.platform`} className={inputClass} placeholder="YouTube Music" />
                  {errors.links?.[index]?.platform && <p className="mt-2 text-sm text-red-600">{errors.links[index]?.platform?.message}</p>}
                </div>
                <div>
                  <label htmlFor={`links.${index}.url`} className="text-xs font-medium text-black/60">Release URL</label>
                  <input {...register(`links.${index}.url`)} id={`links.${index}.url`} type="url" className={inputClass} placeholder="https://music.youtube.com/..." />
                  {errors.links?.[index]?.url && <p className="mt-2 text-sm text-red-600">{errors.links[index]?.url?.message}</p>}
                </div>
                <button type="button" onClick={() => removeLink(index)} aria-label={`Remove ${field.platform || 'listening'} link`} className="grid size-11 place-items-center rounded-full text-black/45 hover:bg-white hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 border-t border-black/[0.07] pt-7 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="text-sm font-medium">Catalogue status</label>
            <select {...register('status')} id="status" className={inputClass}>
              <option value="DRAFT">Draft (hidden from public)</option>
              <option value="PUBLISHED">Published / scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-3 self-end rounded-2xl bg-[#f7f5f1] p-4 text-sm font-medium">
            <input {...register('isFeatured')} type="checkbox" className="size-4 accent-black" />
            Feature this release when public
          </label>
        </section>

        <section className="border-t border-black/[0.07] pt-7">
          <h2 className="text-xl font-semibold tracking-[-0.03em]">Catalogue preview</h2>
          <div className="mt-4 grid gap-5 rounded-2xl bg-[#f7f5f1] p-4 sm:grid-cols-[180px_1fr]">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#e8e5df]">
              {coverUrl ? <img src={coverUrl} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-5xl font-semibold text-black/15">M</div>}
            </div>
            <div className="py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-black/40">{releaseType} · {status.toLowerCase()}</p>
              <h3 className="mt-2 text-2xl font-semibold">{title || 'Release title'}</h3>
              <p className="mt-1 text-sm text-black/55">{artistName || 'Artist name'}</p>
              <p className="mt-3 text-sm text-black/45">{tracks.filter((track) => track.title.trim()).length} track(s) · {links.length} listening link(s)</p>
              {releaseDate && <p className="mt-1 text-sm text-black/45">{new Date(releaseDate).toLocaleString()}</p>}
            </div>
          </div>
        </section>

        {successMessage && <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">{successMessage}</p>}
        {serverError && (
          <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {serverError}
            {(serverError.includes('sign in') || serverError.includes('authorized')) && (
              <Link href="/admin/login" className="ml-2 font-semibold underline underline-offset-2">Sign in</Link>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.07] pt-7">
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? 'Saving release...' : isEditing ? 'Save changes' : 'Save release'}
          </button>
          <Link href="/admin/music" className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition hover:bg-black/[0.04]">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
