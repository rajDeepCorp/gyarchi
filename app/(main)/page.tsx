// app/(main)/page.tsx

import { adminDb } from "@/firebaseAdmin";
import SearchFeed from "@/components/ui/SearchFeed";

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
        <main className="flex flex-col items-center gap-6 mt-8">
            <SearchFeed posts={posts} />
        </main>
    );
}