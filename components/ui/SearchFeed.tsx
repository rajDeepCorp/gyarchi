// components/ui/SearchFeed.tsx

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
    id: string;
    imageUrl: string;
    title?: string;
    description?: string;
    username?: string;
    tags?: string[];
};

export default function SearchFeed({
    posts,
}: {
    posts: Post[];
}) {
    const [search, setSearch] = useState("");

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return posts;

        return posts.filter((post) => {
            const title = post.title?.toLowerCase() || "";
            const description = post.description?.toLowerCase() || "";
            const username = post.username?.toLowerCase() || "";
            const tags = post.tags?.map((tag) => tag.toLowerCase()) || [];

            return (
                title.includes(query) ||
                description.includes(query) ||
                username.includes(query) ||
                tags.some((tag) => tag.includes(query))
            );
        });
    }, [posts, search]);

    return (
        <>
            <div className="relative max-w-lg min-w-xs shadow shadow-stone-500 m-2 px-2 py-1 rounded-4xl">
                <input
                    type="search"
                    placeholder="Search artworks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl shadow-inner shadow-stone-500 p-1 ring-none outline-none"
                />
            </div>

            <section className="columns-2 lg:columns-3 xl:columns-5 2xl:columns-7 gap-4">
                {filteredPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/art/${post.id}`}
                        className="block break-inside-avoid mb-4"
                    >
                        <Image
                            width={720}
                            height={720}
                            src={post.imageUrl}
                            alt={post.title || "Artwork"}
                            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,(max-width:1536px) 33vw,20vw"
                            className="rounded-xl shadow shadow-stone-500 hover:opacity-90 transition"
                        />
                    </Link>
                ))}
            </section>
        </>
    );
}