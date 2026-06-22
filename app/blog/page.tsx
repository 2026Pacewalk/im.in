import type { Metadata } from "next";
import { getPosts } from "@/lib/wp";
import PostCard from "@/components/PostCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | InviteMart",
  description:
    "Ideas, tips and inspiration for digital invitations, wedding cards and celebration design.",
};

export default async function BlogIndex(props: PageProps<"/blog">) {
  const sp = await props.searchParams;
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;
  const { items } = await getPosts({ page, perPage: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Blog</h1>
      <p className="mt-1 text-gray-500">
        Inspiration &amp; tips for beautiful invitations.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
