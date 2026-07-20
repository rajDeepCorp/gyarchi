// components/ui/SideNavSection.tsx

import React from 'react';
import { AnimatePresence, motion } from "motion/react";
import { RiTwitterXLine } from "react-icons/ri";
import { SlSocialFacebook, SlSocialInstagram, SlSocialLinkedin, SlSocialYoutube } from "react-icons/sl";
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import SignoutButton from './SignoutButton';

interface SideNavSectionProps {
    animateNav: boolean;
    setAnimateNav: React.Dispatch<React.SetStateAction<boolean>>;
    setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavSection = ({
    animateNav,
    setAnimateNav,
    setIsNavOpen,
}: SideNavSectionProps) => {

    const { data: session } = authClient.useSession();
    const user = session?.user;

    interface SocialIcon {
        href: string;
        icon: React.ReactNode;
        delay: number;
    }

    const icons: SocialIcon[] = [
        { href: 'https://www.instagram.com', icon: <SlSocialInstagram />, delay: 0.52 },
        { href: 'https://www.facebook.com', icon: <SlSocialFacebook />, delay: 0.54 },
        { href: 'https://x.com', icon: <RiTwitterXLine />, delay: 0.56 },
        { href: 'https://www.youtube.com/', icon: <SlSocialYoutube />, delay: 0.58 },
        { href: 'https://www.linkedin.com/', icon: <SlSocialLinkedin />, delay: 0.6 },
    ];

    interface NavLink {
        href: string;
        label: string;
        delay: number;
    }

    const navLinks: NavLink[] = [
        { href: '/', label: 'Home', delay: 1.8 },
        { href: '/settings', label: 'Settings', delay: 1.6 },
        { href: '/about', label: 'About', delay: 1.4 },
        { href: '/help', label: 'Help', delay: 1.2 },
    ];

    const closeAnimateNav = (): void => {
        setAnimateNav(false);
        setTimeout(() => setIsNavOpen(false), 250);
    }

    return (
        <AnimatePresence>
            {animateNav && (
                <motion.div
                    key="nav-section"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeIn" }}
                    className="fixed top-0 left-0 w-full origin-right z-20 bg-stone-200 h-screen px-[5vw] sm:px-[15vw] py-[12vh] sm:flex sm:flex-col sm:items-end sm:justify-end"
                >
                    {/* Social Icons */}
                    <div className='text-2xl'>
                        {icons.map(({ href, icon, delay }, idx) => (
                            <motion.a
                                key={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={href}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.3, ease: "easeIn", delay }}
                                className='relative p-3 mr-4 bg-stone-800 mix-blend-difference BgBlowUp hover:text-stone-950 transition-all duration-300 ease-in-out origin-center rounded-full inline-flex'
                            >
                                {icon}
                            </motion.a>
                        ))}
                    </div>

                    {/* Email */}
                    <motion.p
                        className='mt-10 origin-bottom mix-blend-difference text-stone-400 text-xl'
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 1.2 }}
                    >
                        Email
                    </motion.p>
                    <motion.p
                        className='mt-1 origin-bottom mix-blend-difference flex text-stone-100 text-xl'
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 1.4 }}
                    >
                        <a href={`mailto:${user?.email}`}>
                            {user?.email ?? "Not Available"}
                        </a>
                    </motion.p>

                    {/* Phone */}
                    <motion.p
                        className='mt-5 origin-bottom mix-blend-difference text-stone-400 text-xl'
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 1.6 }}
                    >
                        Phone
                    </motion.p>

                    <motion.p
                        className='mt-1 origin-bottom mix-blend-difference flex text-stone-100 text-xl'
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 1.8 }}
                    >
                        <a href={`tel:${user?.mobile}`}>
                            {user?.mobile ?? "Not Available"}
                        </a>
                    </motion.p>

                    {/* Bottom Nav Links */}
                    <motion.div
                        className="absolute bottom-0 sm:top-0 sm:left-[15vw] sm:mb-0 mb-10 text-6xl sm:text-[7vw] font-bold sm:font-extrabold sm:tracking-wider antialiased flex flex-col justify-center gap-2 items-start mix-blend-difference group"
                    >
                        {navLinks.map(({ href, label, delay }, idx) => (
                            <motion.div
                                key={href}
                                initial={{ opacity: 0, y: 150, scaleY: 0 }}
                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                transition={{ duration: 0.3, ease: "easeIn", delay }}
                                className="transition-all origin-bottom ease-out group-hover:text-stone-500 border-b-4 border-transparent hover:border-b-stone-100 hover:text-stone-100!"
                            >
                                <Link onClick={closeAnimateNav} href={href}>{label}</Link>
                            </motion.div>
                        ))}
                        <SignoutButton />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SideNavSection
