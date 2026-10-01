import { PostList } from '@/components/posts/post-list';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="mb-10">
        <p className="mb-3 text-sm font-medium text-zinc-500">
          THE OFFICIAL HOME OF
        </p>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
          Makayla Malaka
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
          Music, moments, events and everything
          happening in Makayla's world.
        </p>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-medium text-zinc-500">
            LATEST
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            From Makayla
          </h2>
        </div>

        <PostList />
      </section>
    </div>
  );
}