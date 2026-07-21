// components/ui/ArtworkDescription.tsx

"use client";

import { useMemo, useState } from "react";

type Props = {
    description?: string;
    tags?: string[];
};

export default function ArtworkDescription({
    description,
    tags = [],
}: Props) {
    const [showDescription, setShowDescription] = useState(false);
    const [showTags, setShowTags] = useState(false);

    const words = useMemo(
        () => (description ? description.trim().split(/\s+/) : []),
        [description]
    );

    const shortDescription = words.slice(0, 3).join(" ");
    const hasMoreDescription = words.length > 3;

    const visibleTags = showTags ? tags : tags.slice(0, 3);
    const hasMoreTags = tags.length > 3;

    return (
        <>
            {description && (
                <div className="mt-3 max-w-2xl text-white/90">
                    <span>
                        {showDescription
                            ? description
                            : shortDescription}
                    </span>

                    {hasMoreDescription && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowDescription(!showDescription)
                            }
                            className="ml-2 font-semibold text-white underline"
                        >
                            {showDescription ? "Show less" : "Show more"}
                        </button>
                    )}
                </div>
            )}

            {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {visibleTags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-md"
                        >
                            #{tag}
                        </span>
                    ))}

                    {hasMoreTags && (
                        <button
                            type="button"
                            onClick={() => setShowTags(!showTags)}
                            className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md"
                        >
                            {showTags ? "Show less" : "Show more"}
                        </button>
                    )}
                </div>
            )}
        </>
    );
}