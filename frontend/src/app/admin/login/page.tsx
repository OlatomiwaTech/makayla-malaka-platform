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
  const [recoveryStep, setRecoveryStep] = useState<'login' | 'request' | 'verify'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const readError = (error: unknown, fallback: string) =>
    typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
      ? error.message
      : error instanceof Error
        ? error.message
        : fallback;

  const requestResetCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecoveryError(null);
    setRecoveryNotice(null);
    setRecoveryLoading(true);
    try {
      const result = await api<{ message: string }>('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail }),
      });
      setRecoveryNotice(result.message);
      setRecoveryStep('verify');
    } catch (error) {
      setRecoveryError(readError(error, 'Could not send the password reset code.'));
    } finally {
      setRecoveryLoading(false);
    }
  };

  const submitNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRecoveryError(null);
    setRecoveryNotice(null);
    setRecoveryLoading(true);
    try {
      const result = await api<{ message: string }>('/auth/password-reset/verify', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail, code: recoveryCode, password: newPassword }),
      });
      setRecoveryStep('login');
      setRecoveryCode('');
      setNewPassword('');
      setRecoveryNotice(result.message);
    } catch (error) {
      setRecoveryError(readError(error, 'Could not reset the password.'));
    } finally {
      setRecoveryLoading(false);
    }
  };

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

      {recoveryStep === 'login' && (
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
          <button
            type="button"
            onClick={() => {
              setRecoveryEmail(watch('email') || '');
              setRecoveryError(null);
              setRecoveryNotice(null);
              setRecoveryStep('request');
            }}
            className="mt-3 text-sm font-medium text-black/55 underline underline-offset-4 hover:text-black"
          >
            Forgot password?
          </button>
        </div>

        {recoveryNotice && <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">{recoveryNotice}</p>}
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
      )}

      {recoveryStep === 'request' && (
        <form onSubmit={requestResetCode} className="space-y-5 rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Reset your password</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">Enter the email address for your content manager account. We’ll send a six-digit code if the account is eligible.</p>
          </div>
          <div>
            <label htmlFor="recovery-email" className="text-sm font-medium">Account email</label>
            <input id="recovery-email" type="email" required autoComplete="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
          </div>
          {recoveryError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{recoveryError}</p>}
          <button type="submit" disabled={recoveryLoading} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{recoveryLoading ? 'Sending code…' : 'Send reset code'}</button>
          <button type="button" onClick={() => { setRecoveryStep('login'); setRecoveryError(null); }} className="w-full text-sm font-medium text-black/55 underline underline-offset-4">Back to sign in</button>
        </form>
      )}

      {recoveryStep === 'verify' && (
        <form onSubmit={submitNewPassword} className="space-y-5 rounded-[28px] border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Enter your code</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">Check {recoveryEmail} for the six-digit reset code. It expires in 10 minutes.</p>
          </div>
          {recoveryNotice && <p role="status" className="rounded-2xl bg-green-50 p-4 text-sm text-green-800">{recoveryNotice}</p>}
          <div>
            <label htmlFor="recovery-code" className="text-sm font-medium">One-time code</label>
            <input id="recovery-code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={recoveryCode} onChange={(event) => setRecoveryCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 tracking-[0.35em] outline-none focus:border-black" />
          </div>
          <div>
            <label htmlFor="new-password" className="text-sm font-medium">New password</label>
            <input id="new-password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-black" />
            <p className="mt-2 text-xs text-black/45">Use at least 12 characters.</p>
          </div>
          {recoveryError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{recoveryError}</p>}
          <button type="submit" disabled={recoveryLoading || recoveryCode.length !== 6 || newPassword.length < 12} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{recoveryLoading ? 'Updating password…' : 'Reset password'}</button>
          <div className="flex justify-between gap-4 text-sm">
            <button type="button" onClick={() => { setRecoveryStep('request'); setRecoveryError(null); setRecoveryNotice(null); }} className="font-medium text-black/55 underline underline-offset-4">Change email</button>
            <button type="button" onClick={() => { setRecoveryStep('login'); setRecoveryError(null); setRecoveryNotice(null); }} className="font-medium text-black/55 underline underline-offset-4">Back to sign in</button>
          </div>
        </form>
      )}

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
