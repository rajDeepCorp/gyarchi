// components/profile/ProfileTabs.tsx

"use client";
import { useState } from "react";
import UserPosts from "@/components/ui/UserPosts";

type Post = {
    id: string;
    imageUrl: string;
    title: string;
};

type ProfileTabsProps = {
    posts: Post[];
    likedPosts: Post[];
};

export default function ProfileTabs({
    posts,
    likedPosts,
}: ProfileTabsProps) {
    const [tab, setTab] = useState<"artworks" | "liked">("artworks");

    return (
        <div className="relative w-full flex flex-col justify-center items-center mt-4 gap-2">
            <p className="relative w-full max-w-2xl text-center text-lg text-shadow-xs text-shadow-stone-500 fancyFont shadow shadow-stone-500 rounded-t-full">
                <button
                    onClick={() => setTab("artworks")}
                    className={`px-2 cursor-pointer ${tab === "artworks" ? "underline" : ""
                        }`}
                >
                    Artworks
                </button>

                {" | "}

                <button
                    onClick={() => setTab("liked")}
                    className={`px-2 cursor-pointer ${tab === "liked" ? "underline" : ""
                        }`}
                >
                    Liked
                </button>
            </p>

            {tab === "artworks" ? (
                <UserPosts posts={posts} />
            ) : (
                <UserPosts posts={likedPosts} />
            )}
        </div>
    );
}