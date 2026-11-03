import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fan account',
  robots: { index: false, follow: false, noarchive: true },
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
