'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { api, authTokenStore } from '@/lib/api';

const formSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

type LoginResponse = {
  token: string;
};

export default function AccountLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

      queryClient.removeQueries({ queryKey: ['profile'] });
      authTokenStore.set(result.token);
      router.push('/account/profile');
      router.refresh();
    } catch (error) {
      setServerError(
        typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6538]">Makayla Malaka</p>
        <h1 className="mt-2 font-serif text-4xl tracking-[-0.05em] text-[#542c28]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[#654b44]/65">Sign in to view and update your fan profile.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[28px] border border-[#8b4a35]/10 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[#542c28]">Email</label>
          <input {...register('email')} id="email" type="email" autoComplete="email" className="mt-2 w-full rounded-2xl border border-[#8b4a35]/15 px-4 py-3 outline-none focus:border-[#8d344b]" />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-[#542c28]">Password</label>
          <input {...register('password')} id="password" type="password" autoComplete="current-password" className="mt-2 w-full rounded-2xl border border-[#8b4a35]/15 px-4 py-3 outline-none focus:border-[#8d344b]" />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {serverError && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#8d344b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#74283d] disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#654b44]/65">
        New here? <Link href="/register" className="font-semibold text-[#8d344b] underline underline-offset-4">Create a fan account</Link>
      </p>
      <Link href="/admin/login" className="mt-4 inline-block text-sm text-[#654b44]/55 underline underline-offset-4">Content team sign in</Link>
    </main>
  );
}
