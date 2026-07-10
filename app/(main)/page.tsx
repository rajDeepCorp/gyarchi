// app/(main)/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function Home() {

    const images = [1, 2, 3, 4, 5];
    return (
        <div className="relative flex flex-col justify-center items-center gap-2">
            <div className="relative max-w-lg min-w-xs shadow shadow-stone-500 m-2 p-2 rounded-2xl text-center">
                Search
            </div>
            <div className="relative columns-2 lg:columns-3 xl:columns-5 2xl:columns-7">
                {images.map((image) => (
                    <Link
                        key={image}
                        href={`/art/${image}`}
                    >
                        <Image
                            width={720}
                            height={720}
                            src={`/${image}.jpg`}
                            alt={`Image ${image}`}
                            className="rounded-xl mb-4 shadow shadow-stone-500 hover:opacity-90 transition"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
