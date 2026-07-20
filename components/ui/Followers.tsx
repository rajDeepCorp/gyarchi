"use client";

import { useEffect, useState } from "react";

type Props = {
    profileUserId: string;
    currentUserId?: string;
    followersCount: number;
    followingCount: number;
};

const Followers = ({
    profileUserId,
    currentUserId,
    followersCount: initialFollowers,
    followingCount,
}: Props) => {

    const [followersCount, setFollowersCount] = useState(initialFollowers);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const isOwnProfile =
        currentUserId && currentUserId === profileUserId;

    useEffect(() => {
        if (!currentUserId || isOwnProfile) return;

        const checkFollowing = async () => {
            try {
                const response = await fetch(
                    `/api/follow/status?targetUserId=${profileUserId}`
                );

                if (!response.ok) return;

                const data = await response.json();

                setIsFollowing(data.following);
            } catch (error) {
                console.error(error);
            }
        };

        checkFollowing();
    }, [currentUserId, profileUserId, isOwnProfile]);

    const handleFollow = async () => {
        if (!currentUserId || loading) return;

        setLoading(true);

        try {
            const response = await fetch("/api/follow", {
                method: isFollowing ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    targetUserId: profileUserId,
                }),
            });

            if (!response.ok) {
                throw new Error();
            }

            if (isFollowing) {
                setIsFollowing(false);
                setFollowersCount((prev) => prev - 1);
            } else {
                setIsFollowing(true);
                setFollowersCount((prev) => prev + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl flex justify-around items-center mt-4">

            {!isOwnProfile && (
                <button
                    onClick={handleFollow}
                    disabled={loading}
                    className="relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center cursor-pointer disabled:opacity-50"
                >
                    {loading
                        ? "..."
                        : isFollowing
                            ? "Following"
                            : "Follow"}

                    <span className="absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                        {followersCount}
                    </span>
                </button>
            )}

            <button className="relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center">
                Following

                <span className="absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                    {followingCount}
                </span>
            </button>

            <button className="relative text-xs translate-x-[-25%] rounded-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center">
                Hire
            </button>

        </div>
    );
};

export default Followers;