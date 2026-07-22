// components/ui/UserPosts.tsx

import Image from "next/image";
import Link from "next/link";


type Post = {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    thumbnailUrl?: string | null;
    title: string;
};

interface UserPostsProps {
    posts: Post[];
}

const UserPosts = ({ posts }: UserPostsProps) => {
    if (posts.length === 0) {
        return (
            <div className="relative shadow-inner shadow-stone-500 rounded-2xl mx-1 my-2 p-8 text-center">
                No artworks uploaded yet.
            </div>
        );
    }

    return (
        <div className="relative columns-2 lg:columns-3 xl:columns-5 2xl:columns-7">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/art/${post.id}`}
                    className="relative inline-block"
                >
                    <Image
                        width={720}
                        height={720}
                        src={
                            post.mediaType === "video"
                                ? (post.thumbnailUrl || "/1.jpg")
                                : post.mediaUrl
                        }
                        alt={post.title || "Artwork"}
                        className="rounded-xl mb-4 shadow shadow-stone-500 hover:opacity-90 transition"
                    />
                    {post.mediaType === "video" && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            ▶ VIDEO
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
};

export default UserPosts;