
"use client";
import { useFloatingFunction } from '@/utils/clientfunctions';
import Image from 'next/image'

export const FloatingLogo = () => {
    const scrollingDown = useFloatingFunction();
    return (
        <Image
            src="/Logo.png"
            alt="GyArchi Logo"
            width={32}
            height={32}
            className={`fixed right-2 bottom-2 shadow shadow-stone-500 rounded-xl transition-transform duration-300 ease-out ${scrollingDown ? "translate-y-[125%]" : "translate-y-0"}`}
        />
    )
}
