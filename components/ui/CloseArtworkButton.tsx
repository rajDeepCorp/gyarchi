"use client";

import { useRouter } from "next/navigation";
import { GiCrossMark } from "react-icons/gi";

export default function CloseArtworkButton() {
    const router = useRouter();

    const close = () => {
        document.querySelectorAll("video").forEach((video) => {
            video.pause();
            video.currentTime = 0;
        });

        router.push("/");
    };

    return (
        <button
            onClick={close}
            className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/60"
        >
            <GiCrossMark />
        </button>
    );
}