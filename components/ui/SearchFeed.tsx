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
    createdAt?: number;
};

export default function SearchFeed({
    posts,
}: {
    posts: Post[];
}) {
    const [search, setSearch] = useState("");

    const filteredPosts = useMemo(() => {
        const query = search.trim().toLowerCase();

        // Search box empty hai to original order hi rakho
        if (!query) return posts;

        return posts
            .map((post) => {
                let score = 0;

                const title = (post.title || "").toLowerCase();
                const description = (post.description || "").toLowerCase();
                const username = (post.username || "").toLowerCase();
                const tags = (post.tags || []).map((tag) => tag.toLowerCase());

                // ---------- TITLE ----------
                if (title === query) score += 1000;
                else if (title.startsWith(query)) score += 800;
                else if (title.includes(query)) score += 600;

                // ---------- TAGS ----------
                tags.forEach((tag) => {
                    if (tag === query) score += 500;
                    else if (tag.startsWith(query)) score += 400;
                    else if (tag.includes(query)) score += 300;
                });

                // ---------- USERNAME ----------
                if (username === query) score += 250;
                else if (username.startsWith(query)) score += 200;
                else if (username.includes(query)) score += 150;

                // ---------- DESCRIPTION ----------
                if (description.includes(query)) score += 100;

                return {
                    post,
                    score,
                };
            })
            // sirf matched posts
            .filter((item) => item.score > 0)
            // highest score sabse pehle
            .sort((a, b) => {
                // Pehle relevance
                if (b.score !== a.score) {
                    return b.score - a.score;
                }

                // Score same ho to newest pehle
                return (b.post.createdAt || 0) - (a.post.createdAt || 0);
            })
            .map((item) => item.post);
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
                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1536px) 33vw, 20vw"
                            className="rounded-xl shadow shadow-stone-500 hover:opacity-90 transition"
                        />
                    </Link>
                ))}
            </section>
        </>
    );
}