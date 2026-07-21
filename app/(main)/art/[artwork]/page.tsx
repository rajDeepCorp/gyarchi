
// app/(main)/art/[artwork]/page.tsx

import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@/lib/auth";
import PostButtons from "@/components/ui/PostButtons";
import ArtworkViewer from "@/components/ui/ArtworkViewer";

type ArtworkPageProps = {
    params: Promise<{
        artwork: string;
    }>;
};

type Post = {
    title: string;
    description?: string;
    imageUrl: string;
    username: string;
    likes: number;
    likedBy?: Record<string, true>;
    saves: number;
    savedBy?: Record<string, true>;
    got: number;
    gotBy?: Record<string, true>;
    createdAt: number;
    tags: string[];
};

type RelatedPost = Post & {
    id: string;
    score: number;
};

export async function generateMetadata({
    params,
}: ArtworkPageProps): Promise<Metadata> {
    const { artwork } = await params;

    const snapshot = await adminDb.ref(`posts/${artwork}`).get();

    if (!snapshot.exists()) {
        return {
            title: "Artwork Not Found | GyArchi",
            description: "The requested artwork could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const post = snapshot.val() as Post;

    const title = `${post.title} by ${post.username} | GyArchi`;

    const description =
        post.description?.trim() ||
        `Discover "${post.title}" created by ${post.username} on GyArchi. Explore artwork, connect with artists, and find creative inspiration.`;

    const canonical = `https://gyarchi.vercel.app/art/${artwork}`;

    return {
        title,
        description,

        keywords: [
            ...(post.tags ?? []),
            "GyArchi",
            "Artwork",
            "Art",
            "Digital Art",
            "Illustration",
            "Tattoo",
            "Tattoo Design",
            "Creative",
            post.username,
            post.title,
        ],

        authors: [
            {
                name: post.username,
            },
        ],

        creator: post.username,
        publisher: "GyArchi",

        alternates: {
            canonical,
        },

        openGraph: {
            type: "article",
            url: canonical,
            siteName: "GyArchi",
            title,
            description,
            images: [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 1200,
                    alt: post.title,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [post.imageUrl],
            creator: post.username,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function Artwork({
    params,
}: ArtworkPageProps) {
    const { artwork } = await params;
    const snapshot = await adminDb.ref(`posts/${artwork}`).get();
    if (!snapshot.exists()) { notFound(); }

    const post = snapshot.val() as Post;
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user.id;
    const liked = !!(userId && post.likedBy?.[userId]);
    const saved = !!(userId && post.savedBy?.[userId]);
    const gotted = !!(userId && post.gotBy?.[userId]);

    // Related Posts
    // Related Posts
    const allSnapshot = await adminDb.ref("posts").get();

    let relatedPosts: RelatedPost[] = [];

    if (allSnapshot.exists()) {
        const data = allSnapshot.val();

        const currentTags = new Set(post.tags ?? []);

        relatedPosts = Object.entries(data)
            .map(([id, value]) => {
                const item = {
                    id,
                    ...(value as Post),
                };

                const score = item.tags?.reduce(
                    (count, tag) => count + (currentTags.has(tag) ? 1 : 0),
                    0
                ) ?? 0;

                return {
                    ...item,
                    score,
                };
            })
            .filter((item) => item.id !== artwork && item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }

                return b.createdAt - a.createdAt;
            });
    }

    const nextRelatedPost = relatedPosts[0] ?? null;

    return (
        <main className="fixed top-0 left-0 h-screen min-h-svh min-w-svw w-screen overflow-hidden bg-black z-50">
            {/* Background Artwork */}
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                sizes="100svw"
                className="object-cover"
            />

            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/30" />

            <ArtworkViewer>
                {/* Top Bar */}
                <div className="absolute top-0 left-0 z-50 flex w-full items-center justify-between p-0">
                    <Link
                        href="/"
                        className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/60"
                    >
                        ←
                    </Link>
                </div>

                {/* Right Side Buttons */}
                <PostButtons
                    postId={artwork}
                    likes={post.likes ?? 0}
                    saves={post.saves ?? 0}
                    got={post.got ?? 0}
                    liked={liked}
                    saved={saved}
                    gotted={gotted}
                    isAuthenticated={!!session}
                />

                {/* Bottom Content */}
                <div className="absolute bottom-0 -left-10  z-30 w-full p-0 scale-75">
                    <div className="max-w-3xl">
                        <Link
                            href={`/${post.username}`}
                            className="inline-block text-lg font-bold text-white hover:underline"
                        >
                            {post.username}
                        </Link>

                        <h1 className="mt-3 text-3xl font-bold text-white drop-shadow">
                            {post.title}
                        </h1>

                        {post.description && (
                            <p className="mt-3 max-w-2xl text-white/90">
                                {post.description}
                            </p>
                        )}

                        {post.tags?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-md"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </ArtworkViewer>
            {nextRelatedPost && (
                <Link
                    href={`/art/${nextRelatedPost.id}`}
                    className="absolute bottom-4 right-4 z-50 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/60"
                >
                    Next →
                </Link>
            )}
        </main>
    );
}


