'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { api } from '@/lib/api';

const formSchema = z.object({
  displayName: z.string().trim().min(2, 'Enter your name').max(50),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters').max(128),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
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
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setCreated(true);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Unable to create this account. Please try again.';
      setServerError(message);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
          Makayla Malaka
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
          Create an account
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/50">
          New accounts start with regular access. The owner can grant content-management access later.
        </p>
      </div>

      {created ? (
        <div role="status" className="rounded-[28px] bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold">Account created</h2>
          <p className="mt-2 text-sm leading-6 text-black/55">
            Your account has regular access. Ask the owner to grant you content access if you need to add songs or videos.
          </p>
          <Link href="/admin/login" className="mt-5 inline-block rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <label htmlFor="displayName" className="text-sm font-medium">Your name</label>
            <input {...register('displayName')} id="displayName" autoComplete="name" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            {errors.displayName && <p className="mt-2 text-sm text-red-600">{errors.displayName.message}</p>}
          </div>

          <div>
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input {...register('username')} id="username" autoComplete="username" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input {...register('email')} id="email" type="email" autoComplete="email" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input {...register('password')} id="password" type="password" autoComplete="new-password" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            <p className="mt-2 text-xs text-black/45">Use at least 12 characters.</p>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {serverError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{serverError}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      )}

      <Link href="/admin/login" className="mt-6 inline-block text-sm font-medium text-black/55 hover:text-black">
        Already registered? Sign in
      </Link>
    </main>
  );
}
