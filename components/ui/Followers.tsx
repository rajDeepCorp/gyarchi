// components/ui/Followers.tsx

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    followers: number;
    following: number;
    username: string;
};

const Followers = ({ followers, following, username }: Props) => {
    const [followersCount, setFollowersCount] = useState(followers);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            try {
                const res = await fetch(
                    `/api/auth/update-followers?username=${encodeURIComponent(username)}`
                );

                if (!res.ok) return;

                const data = await res.json();

                setIsFollowing(data.following);
            } catch { }
        };

        checkFollowing();
    }, [username]);

    const handleFollow = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const res = await fetch("/api/auth/update-followers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    action: isFollowing ? "unfollow" : "follow",
                }),
            });

            if (res.status === 401) {
                toast.error("Please Sign in to Follow");
                return;
            }

            if (!res.ok) return;

            if (isFollowing) {
                setFollowersCount((prev) => Math.max(0, prev - 1));
                setIsFollowing(false);
            } else {
                setFollowersCount((prev) => prev + 1);
                setIsFollowing(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl flex justify-around items-center mt-4">
            <button
                onClick={handleFollow}
                disabled={loading}
                className={`relative text-xs translate-x-[-25%] rounded-l-2xl px-2 py-1 flex justify-center items-center cursor-pointer disabled:opacity-50 ${isFollowing
                    ? "shadow-inner shadow-stone-500"
                    : "shadow shadow-stone-500"
                    }`}
            >
                {loading ? "..." : isFollowing ? "Followers" : "Follow"}

                <span className="absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                    {followersCount}
                </span>
            </button>

            <button className="relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center">
                Following
                <span className="absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                    {following}
                </span>
            </button>

            <button className="relative text-xs translate-x-[-25%] rounded-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center">
                Hire
            </button>
        </div>
    );
};

export default Followers;