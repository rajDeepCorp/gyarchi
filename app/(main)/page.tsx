// app/(main)/page.tsx

import { adminDb } from "@/firebaseAdmin";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const snapshot = await adminDb.ref("posts").get();

    let posts: any[] = [];
    if (snapshot.exists()) {
        const data = snapshot.val();
        posts = Object.entries(data)
            .map(([id, post]: any) => ({
                id,
                ...post,
            }))
            .sort(
                (a: any, b: any) =>
                    b.createdAt - a.createdAt
            );
    }

    return (
        <main className="flex flex-col items-center gap-6">
            <div className="relative max-w-lg min-w-xs shadow shadow-stone-500 m-2 px-2 py-1 rounded-4xl">
                <input
                    type="search"
                    placeholder="Search artworks..."
                    className="w-full rounded-2xl shadow-inner shadow-stone-500 p-1 ring-none outline-none"
                />
            </div>

            <section className="columns-2 lg:columns-3 xl:columns-5 2xl:columns-7 gap-4">
                {posts.map((post) => (
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
                            priority={post.id <= 3}
                            sizes="
                                (max-width:640px) 100vw,
                                (max-width:1024px) 50vw,
                                (max-width:1536px) 33vw,
                                20vw
                            "
                            className="rounded-xl shadow shadow-stone-500 hover:opacity-90 transition"
                        />
                    </Link>
                ))}
            </section>
        </main>
    );
}
