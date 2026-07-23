// components/ui/UserPosts.tsx

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiCircleList } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { MdOutlineVideoStable } from "react-icons/md";

type ReactionType = "like" | "save" | "got";

type Post = {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    thumbnailUrl?: string | null;
    title: string;
    username?: string;
    likes?: number;
    saves?: number;
    got?: number;
    likedBy?: Record<string, true>;
    savedBy?: Record<string, true>;
    gotBy?: Record<string, true>;
};

interface UserPostsProps {
    posts: Post[];
}

const REACTION_LABELS: Record<ReactionType, string> = {
    like: "Like",
    save: "Save",
    got: "Get",
};

const UserPosts = ({ posts }: UserPostsProps) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [mounted, setMounted] = useState(false);
    const currentUsername = session?.user?.username;
    const currentUserId = session?.user?.id;
    const isAuthenticated = !!session;

    const [loaded, setLoaded] = useState<Record<string, boolean>>({});
    const [localPosts, setLocalPosts] = useState<Post[]>(posts);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [reactingId, setReactingId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const markLoaded = (id: string) => {
        setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    };

    const deletePost = async (postId: string) => {
        try {
            setDeletingId(postId);
            const response = await fetch("/api/posts", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Delete failed");
            }

            setLocalPosts((prev) => prev.filter((p) => p.id !== postId));
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Post delete nahi ho paayi.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDelete = (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (deletingId) return;

        toast("Are you sure you want to delete this post?", {
            action: {
                label: "Delete",
                onClick: () => deletePost(postId),
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        });
    };

    const reactionKeyMap = {
        like: { count: "likes", users: "likedBy" },
        save: { count: "saves", users: "savedBy" },
        got: { count: "got", users: "gotBy" },
    } as const;

    const handleReaction = async (
        e: React.MouseEvent,
        postId: string,
        type: ReactionType
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast("Please sign in to continue.", {
                action: {
                    label: "Sign In",
                    onClick: () => router.push("/signin"),
                },
            });
            return;
        }

        if (reactingId) return;

        try {
            setReactingId(`${postId}-${type}`);

            const response = await fetch("/api/posts/reaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, type }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            const { count: mapCount, users: mapUsers } = reactionKeyMap[type];

            setLocalPosts((prev) =>
                prev.map((p) => {
                    if (p.id !== postId) return p;

                    const updatedUsers = { ...(p[mapUsers] || {}) };
                    if (data.reacted && currentUserId) {
                        updatedUsers[currentUserId] = true;
                    } else if (currentUserId) {
                        delete updatedUsers[currentUserId];
                    }

                    return {
                        ...p,
                        [mapCount]: data.count,
                        [mapUsers]: updatedUsers,
                    };
                })
            );

            toast.success(
                data.reacted
                    ? `${REACTION_LABELS[type]}d`
                    : `${REACTION_LABELS[type]} removed`
            );
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setReactingId(null);
        }
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
            {localPosts.map((post) => {
                const isLoaded = !!loaded[post.id];
                const isOwner =
                    mounted && !!currentUsername && post.username === currentUsername;

                const liked = mounted && !!(currentUserId && post.likedBy?.[currentUserId]);
                const saved = mounted && !!(currentUserId && post.savedBy?.[currentUserId]);
                const gotted = mounted && !!(currentUserId && post.gotBy?.[currentUserId]);

                const reactionState: Record<ReactionType, boolean> = {
                    like: liked,
                    save: saved,
                    got: gotted,
                };

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
                            className={`absolute inset-0 rounded-xl bg-stone-300 dark:bg-stone-700 transition-opacity duration-300 ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse"
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
                            className={`relative rounded-xl shadow shadow-stone-500 hover:opacity-90 transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"
                                }`}
                        />
                        {post.mediaType === "video" && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                <MdOutlineVideoStable />
                            </div>
                        )}

                        <details className="absolute top-2 left-2 p-1 rounded-full backdrop-blur-2xl shadow shadow-stone-500 bg-background">
                            <summary
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const detailsEl = e.currentTarget.parentElement as HTMLDetailsElement;
                                    detailsEl.open = !detailsEl.open;
                                }}
                                className="list-none"
                            >
                                <CiCircleList />
                            </summary>
                            <ul
                                className="absolute shadow-inner shadow-stone-500 px-10 py-4 rounded-2xl mt-5 bg-background"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {(["like", "save", "got"] as ReactionType[]).map((type) => (
                                    <li
                                        key={type}
                                        onClick={(e) => handleReaction(e, post.id, type)}
                                        className={`cursor-pointer ${reactionState[type] ? "text-red-500" : ""
                                            } ${reactingId === `${post.id}-${type}`
                                                ? "opacity-50 pointer-events-none"
                                                : ""
                                            }`}
                                    >
                                        {REACTION_LABELS[type]}
                                    </li>
                                ))}
                                <li
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // TODO: report handler
                                    }}
                                >
                                    Report
                                </li>
                                {isOwner && (
                                    <li
                                        onClick={(e) => handleDelete(e, post.id)}
                                        className={
                                            deletingId === post.id
                                                ? "opacity-50 pointer-events-none"
                                                : "text-red-500 cursor-pointer"
                                        }
                                    >
                                        {deletingId === post.id ? "Deleting..." : "Delete"}
                                    </li>
                                )}
                            </ul>
                        </details>
                    </Link>
                );
            })}
        </div>
    );
};

export default UserPosts;