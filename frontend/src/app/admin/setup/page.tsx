'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { authTokenStore, api } from '@/lib/api';

const formSchema = z.object({
  displayName: z.string().trim().min(2, 'Enter your name').max(50),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(12, 'Use at least 12 characters').max(128),
  setupKey: z.string().min(1, 'Enter the setup key'),
});

type FormData = z.infer<typeof formSchema>;
type SetupStatusResponse = {
  data: {
    available: boolean;
    setupKeyConfigured: boolean;
  };
};
type SetupResponse = {
  token: string;
  user: { role: 'ADMIN' };
};

export default function OwnerSetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'available' | 'complete' | 'unconfigured' | 'error'>('checking');
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    let cancelled = false;
    api<SetupStatusResponse>('/auth/setup-status')
      .then((result) => {
        if (cancelled) return;
        if (!result.data.setupKeyConfigured) {
          setStatus('unconfigured');
        } else {
          setStatus(result.data.available ? 'available' : 'complete');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const result = await api<SetupResponse>('/auth/bootstrap-admin', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      authTokenStore.set(result.token);
      router.push('/admin');
      router.refresh();
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Unable to create the owner account. Please try again.';
      setServerError(message);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35">
        One-time setup
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
        Create the owner account
      </h1>
      <p className="mt-3 text-sm leading-6 text-black/55">
        The first account becomes the only full admin. Keep its password private; you can later grant other registered accounts music and video access without giving them account-management permissions.
      </p>

      {status === 'checking' && <p role="status" className="mt-8">Checking setup status...</p>}
      {status === 'error' && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          Could not check setup status. Confirm the backend is running and try again.
        </p>
      )}
      {status === 'complete' && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-black/65">Owner setup is already complete.</p>
          <Link href="/admin/login" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
            Sign in to the content studio
          </Link>
        </div>
      )}
      {status === 'unconfigured' && (
        <p role="alert" className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          Owner setup is disabled. Add a private <code>ADMIN_SETUP_KEY</code> of at least 32 characters to <code>backend/.env</code>, then restart the backend.
        </p>
      )}
      {status === 'available' && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
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
            <p className="mt-2 text-xs text-black/45">Use at least 12 characters; do not reuse a password.</p>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="setupKey" className="text-sm font-medium">One-time setup key</label>
            <input {...register('setupKey')} id="setupKey" type="password" autoComplete="off" className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            <p className="mt-2 text-xs leading-5 text-black/45">Find <code>ADMIN_SETUP_KEY</code> in your private <code>backend/.env</code>. Never share it.</p>
            {errors.setupKey && <p className="mt-2 text-sm text-red-600">{errors.setupKey.message}</p>}
          </div>

          {serverError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{serverError}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? 'Creating owner account...' : 'Create owner account'}
          </button>
        </form>
      )}

      <Link href="/admin/login" className="mt-6 inline-block text-sm font-medium text-black/55 hover:text-black">
        Back to sign in
      </Link>
    </main>
  );
}
