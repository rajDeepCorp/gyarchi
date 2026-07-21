// components/ui/Followers.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    userId: string;
    followers: number;
    following: number;
};

const Followers = ({ followers, following, userId }: Props) => {
    const [followersCount, setFollowersCount] = useState(followers);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState<"followers" | "following" | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            try {
                const res = await fetch(
                    `/api/auth/update-followers?userId=${userId}`
                );

                if (!res.ok) return;

                const data = await res.json();

                setIsFollowing(data.following);
            } catch { }
        };

        checkFollowing();
    }, [userId]);

    useEffect(() => {
        if (!openModal) return;

        const loadUsers = async () => {
            try {
                setModalLoading(true);

                const res = await fetch(
                    `/api/user/follow-list?userId=${userId}&type=${openModal}`
                );

                if (!res.ok) return;

                const data = await res.json();

                setUsers(data.users);
            } finally {
                setModalLoading(false);
            }
        };

        loadUsers();
    }, [openModal, userId]);

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
                    userId,
                    action: isFollowing ? "unfollow" : "follow",
                }),
            });

            if (res.status === 401) {
                toast.error("Please Sign in to Follow");
                return;
            }

            if (res.status === 400) {
                toast.error("Cannot follow yourself");
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

    const handleUserFollow = async (
        targetUserId: string,
        following: boolean
    ) => {
        try {
            const res = await fetch("/api/auth/update-followers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: targetUserId,
                    action: following ? "unfollow" : "follow",
                }),
            });

            if (res.status === 401) {
                toast.error("Please Sign in to Follow");
                return;
            }

            if (!res.ok) return;

            setUsers((prev) =>
                prev.map((user) =>
                    user.userId === targetUserId
                        ? {
                            ...user,
                            following: !following,
                        }
                        : user
                )
            );
        } catch (error) {
            console.error(error);
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

                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenModal("followers");
                    }}
                    className="absolute right-0 z-50 px-2 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                    {followersCount}
                </span>
            </button>

            <button className="relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center">
                Following
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenModal("following");
                    }}
                    className="absolute right-0 z-50 px-2 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl">
                    {following}
                </span>
            </button>
            
            {openModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center"
                    onClick={() => setOpenModal(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-2xl py-4 px-3 bg-background w-105 max-h-125 overflow-y-auto shadow shadow-stone-500"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold">
                                {openModal === "followers"
                                    ? "Followers"
                                    : "Following"}
                            </h2>

                            <button onClick={() => setOpenModal(null)}>
                                ✕
                            </button>
                        </div>

                        {modalLoading ? (
                            <p>Loading...</p>
                        ) : users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.userId}
                                    className="flex justify-between items-center py-2 border-b"
                                >
                                    <div>
                                        <Link
                                            href={`/${user.username}`}
                                            className="font-medium hover:underline"
                                        >
                                            {user.name}
                                        </Link>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleUserFollow(user.userId, user.following)
                                        }
                                        className="text-xs px-3 py-1 rounded-full shadow shadow-stone-500"
                                    >
                                        {user.following ? "Following" : "Follow"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Followers;