'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, UserRoundCog } from 'lucide-react';

import { api } from '@/lib/api';

type ManagedAccount = {
  id: string;
  email: string;
  username: string;
  role: 'FAN' | 'MEDIA_EDITOR' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  profile: { displayName: string } | null;
};
type AccountsResponse = {
  data: { accounts: ManagedAccount[] };
};
type AccountResponse = {
  data: { account: ManagedAccount };
};

const errorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Unable to complete this request.';
};

export default function AdminAccountsPage() {
  const queryClient = useQueryClient();
  const accountsQuery = useQuery({
    queryKey: ['admin', 'accounts'],
    queryFn: () => api<AccountsResponse>('/admin/accounts'),
  });
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'FAN' | 'MEDIA_EDITOR' }) =>
      api<AccountResponse>(`/admin/accounts/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] }),
  });

  const queryStatus =
    typeof accountsQuery.error === 'object' &&
    accountsQuery.error !== null &&
    'status' in accountsQuery.error
      ? accountsQuery.error.status
      : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-black/55 transition hover:text-black">
        <ArrowLeft size={16} />
        Content studio
      </Link>

      <div className="mb-8 mt-7">
        <div className="grid size-12 place-items-center rounded-2xl bg-white">
          <UserRoundCog size={22} />
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
          Content access
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
          Grant registered accounts permission to manage music and videos. Content managers cannot add or manage other accounts; only the owner can do that.
        </p>
        <Link href="/register" className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4">
          Create an account for a new team member
        </Link>
      </div>

      {accountsQuery.isLoading && <p role="status" className="rounded-2xl bg-white p-6 text-sm">Loading accounts...</p>}

      {accountsQuery.isError && (
        <div role="alert" className="rounded-2xl bg-red-50 p-6 text-sm text-red-700">
          {queryStatus === 401 || queryStatus === 403
            ? 'Sign in with the owner account to manage content access.'
            : errorMessage(accountsQuery.error)}
          {(queryStatus === 401 || queryStatus === 403) && (
            <Link href="/admin/login" className="ml-2 font-semibold underline underline-offset-2">
              Sign in
            </Link>
          )}
        </div>
      )}

      {roleMutation.isError && (
        <p role="alert" className="mb-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {errorMessage(roleMutation.error)}
        </p>
      )}

      {accountsQuery.data && (
        <div className="overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto] border-b border-black/[0.07] px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/40 sm:grid-cols-[1fr_1fr_auto_auto]">
            <span>Account</span>
            <span className="hidden sm:block">Email</span>
            <span>Access</span>
            <span className="sr-only">Actions</span>
          </div>
          {accountsQuery.data.data.accounts.map((account) => (
            <div key={account.id} className="grid gap-3 border-b border-black/[0.05] px-5 py-5 last:border-b-0 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {account.profile?.displayName || account.username}
                  {account.role === 'ADMIN' && <span className="ml-2 rounded-full bg-black px-2 py-1 text-[10px] uppercase tracking-wide text-white">Owner</span>}
                </p>
                <p className="mt-1 text-xs text-black/45">@{account.username} · {account.status.toLowerCase()}</p>
                <p className="mt-1 break-all text-xs text-black/45 sm:hidden">{account.email}</p>
              </div>
              <p className="hidden break-all text-sm text-black/60 sm:block">{account.email}</p>
              <span className="text-sm font-medium">
                {account.role === 'ADMIN'
                  ? 'Full owner access'
                  : account.role === 'EDITOR'
                    ? 'Editor'
                    : account.role === 'MEDIA_EDITOR'
                      ? 'Music & videos'
                      : account.role === 'MODERATOR'
                        ? 'Moderator'
                        : 'Regular account'}
              </span>
              {account.role === 'ADMIN' || account.role === 'EDITOR' || account.role === 'MODERATOR' ? (
                <span aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  disabled={roleMutation.isPending || account.status !== 'ACTIVE'}
                  onClick={() => roleMutation.mutate({
                    id: account.id,
                    role: account.role === 'MEDIA_EDITOR' ? 'FAN' : 'MEDIA_EDITOR',
                  })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    account.role === 'MEDIA_EDITOR'
                      ? 'border border-black/10 hover:bg-red-50 hover:text-red-700'
                      : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  {account.role === 'MEDIA_EDITOR' ? 'Revoke' : 'Grant access'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
