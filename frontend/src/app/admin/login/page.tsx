'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { authTokenStore, api } from '@/lib/api';

const formSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;
type LoginResponse = {
  user: {
    role: 'FAN' | 'MEDIA_EDITOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
  };
  token: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      const result = await api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (
        result.user.role !== 'MEDIA_EDITOR' &&
        result.user.role !== 'EDITOR' &&
        result.user.role !== 'ADMIN'
      ) {
        authTokenStore.set(null);
        setServerError('This account does not have permission to manage content.');
        return;
      }

      authTokenStore.set(result.token);
      router.push('/admin');
      router.refresh();
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to sign in. Please try again.';
      setServerError(message);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Content studio
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/50">
          Sign in with a content manager, editor, or admin account to manage catalogues.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="username"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black"
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <Link href="/admin" className="mt-6 inline-block text-sm font-medium text-black/55 hover:text-black">
        Back to content studio
      </Link>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href="/register" className="font-medium text-black/55 underline underline-offset-4 hover:text-black">
          Create a regular account
        </Link>
        <Link href="/admin/setup" className="font-medium text-black/55 underline underline-offset-4 hover:text-black">
          First-time owner setup
        </Link>
      </div>
    </main>
  );
}
