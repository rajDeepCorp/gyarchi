// app/(main)/art/[artwork]/page.tsx

import Image from 'next/image'
import Link from 'next/link';
import { CiHeart, CiSaveDown2, CiShoppingCart } from 'react-icons/ci'

type Props = {
    params: Promise<{
        artwork: string;
    }>;
};

export default async function Artwork({ params }: Props) {

    const { artwork } = await params;
    const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className='relative flex flex-col justify-start items-center gap-4'>
            <div className='relative rounded-2xl overflow-hidden flex justify-center items-center shadow shadow-stone-500'>
                <Image
                    className="relative max-w-full h-auto"
                    width={720}
                    height={720}
                    src={`/${artwork}.jpg`}
                    alt={`Image ${artwork}`}
                />
            </div>
            
            <div className='relative flex justify-center items-center gap-10'>
                <button className='relative text-xl rounded-l-2xl w-14 shadow py-1 shadow-stone-500 flex justify-center items-center'>
                    <CiHeart />
                    <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-sm rounded-r-2xl'>
                        999
                    </span>
                </button>

                <button className='relative text-xl rounded-l-2xl w-14 shadow py-1 shadow-stone-500 flex justify-center items-center'>
                    <CiSaveDown2 />
                    <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-sm rounded-r-2xl'>
                        999
                    </span>
                </button>

                <button className='relative text-xl rounded-l-2xl w-14 shadow py-1 shadow-stone-500 flex justify-center items-center'>
                    <CiShoppingCart />
                    <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-sm rounded-r-2xl'>
                        999
                    </span>
                </button>
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
    )
}
