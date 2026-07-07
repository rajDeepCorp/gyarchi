// app/(main)/page.tsx

import Image from "next/image";

export default function Home() {

    const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <div className="relative flex flex-col justify-center items-center gap-2">
            <div className="relative max-w-lg min-w-xs shadow shadow-stone-500 m-2 p-2 rounded-2xl text-center">
                Search
            </div>
            <div className="relative columns-2 lg:columns-3 xl:columns-5 2xl:columns-7">
                {images.map((image) => (
                    <Image
                        width={720}
                        height={720}
                        key={image}
                        src={`/${image}.jpg`}
                        alt={`Image ${image}`}
                        className="rounded-xl mb-4 shadow shadow-stone-500"
                    />
                ))}
            </div>
        </div>
    );
}
