// app/(main)/art/[artwork]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDb } from "@/firebaseAdmin";
import {
    CiHeart,
    CiSaveDown2,
    CiShoppingCart,
} from "react-icons/ci";

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


export async function generateMetadata({ params }: ArtworkPageProps) {
    const { artwork } = await params;
    const snapshot = await adminDb.ref(`posts/${artwork}`).get();
    if (!snapshot.exists()) {
        return {
            title: "Artwork Not Found",
        };
    }
    const post = snapshot.val() as Post;
    return {
        title: post.title,
        description: post.description,
        keywords: post.tags,
        authors: [
            {
                name: post.username,
            },
        ],
        openGraph: {
            title: post.title,
            description: post.description,
            images: [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 1200,
                    alt: post.title,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [post.imageUrl],
        },
    };
}

const actions = [
    { label: "Like artwork", icon: CiHeart, count: 999, },
    { label: "Save artwork", icon: CiSaveDown2, count: 999, },
    { label: "Add artwork to cart", icon: CiShoppingCart, count: 999, },
] as const;

const buttonClasses =
    "relative text-xl rounded-l-2xl translate-x-[-25%] w-14 shadow py-1 shadow-stone-500 flex justify-center items-center";

const countClasses =
    "absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-sm rounded-r-2xl";

export default async function Artwork({
    params,
}: ArtworkPageProps) {
    const { artwork } = await params;

    const snapshot = await adminDb.ref(`posts/${artwork}`).get();

    if (!snapshot.exists()) {
        notFound();
    }

    const post = snapshot.val() as Post;

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

                const score =
                    item.id === artwork
                        ? 0
                        : item.tags?.filter((tag) => currentTags.has(tag)).length ?? 0;

                return {
                    ...item,
                    score,
                };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);
    }

    return (
        // <main className="mx-auto flex w-full flex-col items-center gap-8">

        //     {/* Hero Image */}
        //     <section className="w-full flex justify-center">
        //         <div className="overflow-hidden rounded-2xl shadow shadow-stone-500">
        //             <Image
        //                 src={post.imageUrl}
        //                 alt={post.title || "Artwork"}
        //                 width={720}
        //                 height={720}
        //                 priority
        //                 sizes="(max-width:768px) 100vw, 720px"
        //                 className="h-auto max-w-full"
        //             />
        //             <Link href="/" className="absolute top-5 translate-x-1.5 rounded-2xl mix-blend-difference text-shadow-xs shadow shadow-stone-500 px-2 z-50">{post.username}</Link>
        //         </div>
        //     </section>

        //     {/* Action Buttons */}
        //     <nav
        //         aria-label="Artwork actions"
        //         className="flex w-full max-w-xl justify-around gap-10"
        //     >
        //         {actions.map(({ icon: Icon, label, count }) => (
        //             <button
        //                 key={label}
        //                 type="button"
        //                 aria-label={label}
        //                 className={buttonClasses}
        //             >
        //                 <Icon />
        //                 <span className={countClasses}>
        //                     {count}
        //                 </span>
        //             </button>
        //         ))}
        //     </nav>

        //     {/* Related Artworks */}
        //     <section
        //         aria-label="Related artworks"
        //         className="columns-2 gap-4 lg:columns-3 xl:columns-5 2xl:columns-7"
        //     >
        //         {relatedPosts.length > 0 ? (
        //             relatedPosts.map((item) => (
        //                 <Link
        //                     key={item.id}
        //                     href={`/art/${item.id}`}
        //                     className="mb-4 block break-inside-avoid"
        //                 >
        //                     <Image
        //                         src={item.imageUrl}
        //                         alt={item.title || "Artwork"}
        //                         width={720}
        //                         height={720}
        //                         loading="lazy"
        //                         sizes="
        //                         (max-width:640px) 100vw,
        //                         (max-width:1024px) 50vw,
        //                         (max-width:1536px) 33vw,
        //                         20vw
        //                     "
        //                         className="rounded-xl shadow shadow-stone-500 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
        //                     />
        //                 </Link>
        //             ))) :
        //             (<p className="text-center text-muted-foreground">
        //                 No related artworks found.
        //             </p>)}
        //     </section>
        // </main>
        <main className="fixed top-0 left-0 h-screen min-h-svh min-w-svw w-screen overflow-hidden bg-black z-50">

            {/* Background Artwork */}
            <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />

            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/30" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 z-50 flex w-full items-center justify-between p-0">
                <Link
                    href="/"
                    className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/60"
                >
                    ← Back
                </Link>
            </div>

            {/* Right Side Buttons */}
            <div className="absolute right-0 bottom-24 z-30 flex flex-col items-center gap-7 text-white scale-75">

                <button className="flex flex-col items-center gap-1 transition hover:scale-110">
                    <CiHeart className="text-5xl drop-shadow-lg" />
                    <span className="text-sm font-semibold">
                        {post.likes ?? 0}
                    </span>
                </button>

                <button className="flex flex-col items-center gap-1 transition hover:scale-110">
                    <CiSaveDown2 className="text-5xl drop-shadow-lg" />
                    <span className="text-sm font-semibold">
                        {post.saves ?? 0}
                    </span>
                </button>

                <button className="flex flex-col items-center gap-1 transition hover:scale-110">
                    <CiShoppingCart className="text-5xl drop-shadow-lg" />
                    <span className="text-sm font-semibold">
                        {post.got ?? 0}
                    </span>
                </button>

            </div>

            {/* Bottom Content */}
            <div className="absolute -bottom-4 -left-10  z-30 w-full p-0 scale-75">
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

        </main>

    );
}