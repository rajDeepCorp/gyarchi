import Image from "next/image";
import Link from "next/link";


type Post = {
    id: string;
    imageUrl: string;
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
                >
                    <Image
                        width={720}
                        height={720}
                        src={post.imageUrl}
                        alt={post.title || "Artwork"}
                        className="rounded-xl mb-4 shadow shadow-stone-500 hover:opacity-90 transition"
                    />
                </Link>
            ))}
        </div>
    );
};

export default UserPosts;