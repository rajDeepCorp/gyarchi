// components/navigation/SideNavbar.tsx

"use client";
import { useState } from 'react';
import Link from 'next/link';
import SideNavButton from '../ui/SideNavButton';
import SideNavSection from '../ui/SideNavSection';
import { CiPaperplane } from 'react-icons/ci';


const SideNavbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [animateNav, setAnimateNav] = useState(false);

    return (
        <>
            <nav className='fixed top-2 z-50 mix-blend-difference sm:text-3xl text-2xl left-0 w-svw px-5 flex justify-between items-center'>
                <SideNavButton
                    isNavOpen={isNavOpen}
                    setIsNavOpen={setIsNavOpen}
                    setAnimateNav={setAnimateNav}
                />
                <Link href="/messages" className='sm:text-5xl text-3xl'><CiPaperplane /></Link>
            </nav>
            <SideNavSection animateNav={animateNav} setAnimateNav={setAnimateNav} setIsNavOpen={setIsNavOpen} />
        </>
    )
}

export default SideNavbar
