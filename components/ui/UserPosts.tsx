// components/ui/UserPosts.tsx

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


type Post = {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    thumbnailUrl?: string | null;
    title: string;
};

interface UserPostsProps {
    posts: Post[];
}

const UserPosts = ({ posts }: UserPostsProps) => {
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});

    const markLoaded = (id: string) => {
        setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    };

    if (posts.length === 0) {
        return (
            <div className="relative shadow-inner shadow-stone-500 rounded-2xl mx-1 my-2 p-8 text-center">
                No artworks uploaded yet.
            </div>
        );
    }

    return (
        <div className="relative columns-2 lg:columns-3 xl:columns-5 2xl:columns-7">
            {posts.map((post) => {
                const isLoaded = !!loaded[post.id];
                return (
                    <Link
                        key={post.id}
                        href={`/art/${post.id}`}
                        className="relative inline-block w-full mb-4"
                    >
                        {/* Skeleton hamesha mounted rehta hai, sirf opacity se hide/show hota hai
                            taaki server aur client ka tree structure kabhi mismatch na ho */}
                        <div
                            aria-hidden="true"
                            className={`absolute inset-0 rounded-xl bg-stone-300 dark:bg-stone-700 transition-opacity duration-300 ${
                                isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse"
                            }`}
                        />
                        <Image
                            width={720}
                            height={720}
                            src={
                                post.mediaType === "video"
                                    ? (post.thumbnailUrl || "/1.jpg")
                                    : post.mediaUrl
                            }
                            alt={post.title || "Artwork"}
                            onLoad={() => markLoaded(post.id)}
                            className={`relative rounded-xl shadow shadow-stone-500 hover:opacity-90 transition-opacity duration-300 ${
                                isLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        />
                        {post.mediaType === "video" && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                ▶ VIDEO
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default UserPosts;