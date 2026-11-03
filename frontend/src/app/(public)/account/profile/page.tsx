'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useMyProfile, useUpdateMyProfile } from '@/hooks/use-profile';
import { authTokenStore } from '@/lib/api';

const formSchema = z.object({
  displayName: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
  bio: z.string().trim().max(160, 'Bio must be at most 160 characters'),
  avatarUrl: z.union([z.string().trim().url('Enter a valid image URL'), z.literal('')]),
});

type FormData = z.infer<typeof formSchema>;

const errorStatus = (error: unknown) =>
  typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
    ? error.status
    : null;

export default function AccountProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profileQuery = useMyProfile();
  const updateProfile = useUpdateMyProfile();
  const profile = profileQuery.data?.profile;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { displayName: '', bio: '', avatarUrl: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.profile?.displayName ?? profile.username,
        bio: profile.profile?.bio ?? '',
        avatarUrl: profile.profile?.avatarUrl ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    await updateProfile.mutateAsync({
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl || null,
    });
    reset(data);
  };

  const signOut = () => {
    authTokenStore.set(null);
    queryClient.removeQueries({ queryKey: ['profile'] });
    router.replace('/account/login');
  };

  if (profileQuery.isPending) {
    return <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><div className="h-72 animate-pulse rounded-3xl bg-[#f4e9dc]" aria-label="Loading profile" /></main>;
  }

  if (profileQuery.isError || !profile) {
    const needsSignIn = errorStatus(profileQuery.error) === 401;

    if (!needsSignIn) {
      return (
        <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
          <section className="rounded-3xl border border-[#8b4a35]/10 bg-white p-7 text-center sm:p-10">
            <h1 className="font-serif text-3xl text-[#542c28]">Profile unavailable</h1>
            <p role="alert" className="mt-3 text-sm leading-6 text-[#654b44]/65">We couldn’t load your profile. Please try again.</p>
            <button type="button" onClick={() => void profileQuery.refetch()} className="mt-6 rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white">Try again</button>
          </section>
        </main>
      );
    }

    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <section className="rounded-3xl border border-[#8b4a35]/10 bg-white p-7 text-center sm:p-10">
          <h1 className="font-serif text-3xl text-[#542c28]">Your fan profile</h1>
          <p className="mt-3 text-sm leading-6 text-[#654b44]/65">Sign in to view and update your profile.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/account/login" className="rounded-full bg-[#8d344b] px-5 py-3 text-sm font-semibold text-white">Sign in</Link>
            <Link href="/register" className="rounded-full border border-[#8b4a35]/20 px-5 py-3 text-sm font-semibold text-[#542c28]">Create account</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a6538]">Your corner of Makayla’s world</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.045em] text-[#542c28]">Fan profile</h1>
        </div>
        <button type="button" onClick={signOut} className="rounded-full border border-[#8b4a35]/20 px-4 py-2 text-sm font-semibold text-[#542c28] transition hover:bg-white">Sign out</button>
      </div>

      <section className="mt-7 rounded-3xl border border-[#8b4a35]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-4 border-b border-[#8b4a35]/10 pb-6">
          {profile.profile?.avatarUrl ? (
            <Image src={profile.profile.avatarUrl} alt="" width={64} height={64} unoptimized className="size-16 rounded-full object-cover" />
          ) : (
            <div aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-[#f7e8d8] font-serif text-2xl text-[#8d344b]">
              {(profile.profile?.displayName ?? profile.username).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-[#542c28]">{profile.email}</p>
            <p className="mt-1 text-sm text-[#654b44]/60">Member since {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(profile.createdAt))}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-[#542c28]">Username</label>
            <input id="username" value={`@${profile.username}`} readOnly className="mt-2 w-full rounded-2xl border border-[#8b4a35]/10 bg-[#fffaf3] px-4 py-3 text-[#654b44]/65" />
            <Link href={`/fans/${encodeURIComponent(profile.username)}`} className="mt-2 inline-block text-sm font-semibold text-[#8d344b] underline underline-offset-4">View your public profile</Link>
          </div>

          <div>
            <label htmlFor="displayName" className="text-sm font-medium text-[#542c28]">Display name</label>
            <input {...register('displayName')} id="displayName" autoComplete="name" className="mt-2 w-full rounded-2xl border border-[#8b4a35]/15 px-4 py-3 outline-none focus:border-[#8d344b]" />
            {errors.displayName && <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>}
          </div>

          <div>
            <label htmlFor="bio" className="text-sm font-medium text-[#542c28]">About you</label>
            <textarea {...register('bio')} id="bio" rows={4} maxLength={160} className="mt-2 w-full resize-y rounded-2xl border border-[#8b4a35]/15 px-4 py-3 outline-none focus:border-[#8d344b]" />
            <p className="mt-1 text-xs text-[#654b44]/50">Up to 160 characters. This appears on your public profile.</p>
            {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
          </div>

          <div>
            <label htmlFor="avatarUrl" className="text-sm font-medium text-[#542c28]">Avatar image URL <span className="font-normal text-[#654b44]/50">(optional)</span></label>
            <input {...register('avatarUrl')} id="avatarUrl" type="url" inputMode="url" placeholder="https://…" className="mt-2 w-full rounded-2xl border border-[#8b4a35]/15 px-4 py-3 outline-none focus:border-[#8d344b]" />
            {errors.avatarUrl && <p className="mt-2 text-sm text-red-600">{errors.avatarUrl.message}</p>}
          </div>

          {updateProfile.isError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{updateProfile.error instanceof Error ? updateProfile.error.message : 'Your profile could not be saved. Please try again.'}</p>}
          {updateProfile.isSuccess && !isDirty && <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">Your profile is up to date.</p>}

          <button type="submit" disabled={updateProfile.isPending || !isDirty} className="w-full rounded-full bg-[#8d344b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d] disabled:cursor-not-allowed disabled:opacity-50">
            {updateProfile.isPending ? 'Saving profile...' : 'Save profile'}
          </button>
        </form>
      </section>
    </main>
  );
}
