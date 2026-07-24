// components/ui/PostButtons.tsx

"use client";
import { CiHeart, CiSaveDown2, CiShoppingCart, } from "react-icons/ci";
import { useCallback, useState } from "react";
import Link from "next/link";
import { formatCount } from "@/utils/numberformat";


type PostButtonsProps = {
    postId: string;
    likes: number;
    saves: number;
    got: number;
    liked: boolean;
    saved: boolean;
    gotted: boolean;
    isAuthenticated: boolean;
    mediaUrl: string;
    title: string;
};

const ACTIONS = [
    { type: "like", countKey: "likes", reactedKey: "liked", Icon: CiHeart, },
    { type: "save", countKey: "saves", reactedKey: "saved", Icon: CiSaveDown2, },
    { type: "got", countKey: "got", reactedKey: "gotted", Icon: CiShoppingCart, },
] as const;


const PostButtons = ({
    postId,
    likes,
    saves,
    got,
    liked,
    saved,
    gotted,
    isAuthenticated,
    mediaUrl,
    title,
}: PostButtonsProps) => {

    const [loading, setLoading] = useState<"like" | "save" | "got" | null>(null);
    const [downloading, setDownloading] = useState(false);

    const [reacted, setReacted] = useState({ liked, saved, gotted, });
    const [counts, setCounts] = useState({ likes, saves, got, });

    // Downloads the media file to the user's device
    const downloadToDevice = useCallback(async () => {
        try {
            setDownloading(true);
            const response = await fetch(mediaUrl);
            const blob = await response.blob();

            const extMatch = mediaUrl.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
            const ext = extMatch ? extMatch[1] : "jpg";
            const safeName = title?.trim()
                ? title.replace(/[^a-z0-9-_ ]/gi, "").trim().replace(/\s+/g, "-")
                : postId;

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${safeName}.${ext}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(error);
            alert("Could not download file.");
        } finally {
            setDownloading(false);
        }
    }, [mediaUrl, title, postId]);

    const handleReaction = useCallback(
        async (type: "like" | "save" | "got") => {
            if (loading) return;
            const action = ACTIONS.find((a) => a.type === type)!;
            try {
                setLoading(type);
                const response = await fetch("/api/posts/reaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId,
                        type,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                setCounts((prev) => ({
                    ...prev,
                    [action.countKey]: data.count,
                }));

                setReacted((prev) => ({
                    ...prev,
                    [action.reactedKey]: data.reacted,
                }));
                if (type === "save") {
                    downloadToDevice();
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            } finally {
                setLoading(null);
            }
        },
        [loading, postId, downloadToDevice]
    );

    if (!isAuthenticated) {
        return (
            <div className="absolute right-0 bottom-24 z-30 flex flex-col items-center gap-7 text-white scale-75">
                <Link
                    href="/signin"
                    className="rounded-full bg-white/20 backdrop-blur-md px-5 py-2"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="absolute right-0 bottom-24 z-30 flex flex-col items-center gap-7 text-white scale-75">
            {ACTIONS.map((action) => (
                <button
                    key={action.type}
                    disabled={loading === action.type || (action.type === "save" && downloading)}
                    onClick={() => handleReaction(action.type)}
                    className="flex flex-col items-center gap-1 transition hover:scale-110 disabled:opacity-50"
                >
                    <action.Icon
                        className={`text-5xl drop-shadow-lg ${reacted[action.reactedKey]
                            ? "text-red-500"
                            : ""
                            }`}
                    />

                    <span className="text-sm font-semibold">
                        {formatCount(counts[action.countKey])}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default PostButtons
