// components/navigation/Navbar.tsx

"use client";
import { useFloatingFunction, useLinksFunction } from '@/utils/clientfunctions'
import Image from 'next/image';
import Link from 'next/link'

const Navbar = () => {
    const scrollingDown = useFloatingFunction();
    const { links, activeKey } = useLinksFunction();

    return (
        <nav
            className={`fixed bottom-0 left-1/2 -translate-x-1/2 shadow shadow-stone-500 bg-background py-2 px-4 my-1 rounded-4xl text-2xl flex justify-center items-center gap-4 transition-transform duration-300 ease-out ${scrollingDown ? "translate-y-[125%]" : "translate-y-0"}`}
        >
            {links.map(({ Icon, label, title, key, href }) => (
                <Link
                    key={key}
                    href={href}
                    aria-label={label}
                    aria-current={activeKey === key ? "page" : undefined}
                    title={title}
                    className={`relative rounded-2xl ${activeKey === key
                        ? "shadow-inner shadow-stone-500 p-1"
                        : "border border-stone-500 p-0.5"
                        }`}
                >
                    <Icon />
                </Link>
            ))}
            <Image
                src="/Logo.png"
                alt="GyArchi Logo"
                width={32}
                height={32}
                className="absolute left-0 -translate-x-10 shadow shadow-stone-500 rounded-xl"
            />
        </nav>
    )
}

export default Navbar
