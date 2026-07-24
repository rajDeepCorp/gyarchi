"use client";
import { useFloatingFunction } from '@/utils/clientfunctions';
import Link from 'next/link'

const MainFooter = () => {
    const scrollingDown = useFloatingFunction();
    return (
        <footer className={`fixed max-w-fit bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs border-t my-1 transition-transform duration-300 ease-out ${scrollingDown ? "translate-y-[125%]" : "translate-y-0"}`}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="ml-2">Terms of Service</Link>
        </footer>
    )
}

export default MainFooter
