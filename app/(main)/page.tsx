// app/(main)/page.tsx

import { adminDb } from "@/firebaseAdmin";
import SearchFeed from "@/components/ui/SearchFeed";
import Image from "next/image";
import MainFooter from "@/components/ui/MainFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "none",
            noimageindex: true,
        },
    },
};

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
            .map((post: any) => {
                const likes = post.likes || 0;
                const saves = post.saves || 0;
                const got = post.got || 0;
                const now = Date.now();
                const ageInDays =
                    (now - (post.createdAt || now)) /
                    (1000 * 60 * 60 * 24);
                let freshness = 0;
                if (ageInDays <= 1) {
                    freshness = 100;
                } else if (ageInDays <= 7) {
                    freshness = 70;
                } else if (ageInDays <= 30) {
                    freshness = 40;
                }
                const score =
                    likes * 2 +
                    saves * 5 +
                    got * 10 +
                    freshness;
                return {
                    ...post,
                    score,
                };
            })
            .sort((a: any, b: any) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return b.createdAt - a.createdAt;
            });
    }
    return (
        <>
            <header className="relative mx-auto sm:max-w-xl max-w-fit text-center shadow shadow-stone-500 rounded-2xl mt-1 py-1 px-1 flex flex-col justify-center items-center gap-1">
                <div className="flex items-center gap-1">
                    <Image
                        src="/Logo.png"
                        alt="GyArchi Logo"
                        width={42}
                        height={42}
                        className="rounded-xl"
                    />
                    <h1 className="text-4xl underline fancyFont">GyArchi</h1>
                </div>
                <p className="text-sm opacity-80 italic">
                    GyArchi is a social platform where artists, designers, photographers and creators showcase their work, build portfolios and connect with the creative community.
                </p>
            </header>
            <main className="flex flex-col items-center gap-6 mt-2">
                <SearchFeed posts={posts} />
            </main>
            <MainFooter />
        </>
    );
}


// {/* <header className="relative mx-auto sm:max-w-xl max-w-fit text-center shadow shadow-stone-500 rounded-2xl mt-1 py-1 px-1 flex justify-center items-center gap-1">
//     <Image
//         src="/Logo.png"
//         alt="GyArchi Logo"
//         width={42}
//         height={42}
//         className={`rounded-xl`}
//     />
//     <details>
//         <summary className="list-none">
//             <h1 className="text-4xl underline fancyFont">GyArchi</h1>
//         </summary>
//         <p
//             className="text-sm opacity-80 italic"
//         >
//             A social platform where artists, designers, photographers and creators showcase their work, build portfolios and connect with the creative community.
//         </p>
//     </details>
// </header> */}