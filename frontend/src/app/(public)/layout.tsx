import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />

      <main className="pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}