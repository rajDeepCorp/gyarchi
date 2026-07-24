// components/ui/BackArrowButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { MdArrowForward } from "react-icons/md";

export default function BackArrowButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="rounded-l-full shadow shadow-stone-500 bg-black/40 px-2 py-1 text-md font-medium text-white backdrop-blur-md transition hover:bg-black/60"
            aria-label="Go back"
        >
            <MdArrowForward className="rotate-180" />
        </button>
    );
}