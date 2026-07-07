// utils/navbarfunctions.ts

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconType } from "react-icons";
import { CiCamera, CiSearch, CiSettings, CiShop, CiUser, } from "react-icons/ci";

type NavKey = | "Home" | "Search" | "Post" | "Settings" | "Profile" | "Signin";
type LinkMeta = { Icon: IconType; label: string; title: string; key: NavKey; href: string; };
const pathToKey: Record<string, NavKey> = { "/": "Home", "/search": "Search", "/post": "Post", "/settings": "Settings", "/profile": "Profile", "/signin": "Signin", "/signup": "Signin", };

export function useFloatingFunction() {
    const [scrollingDown, setScrollingDown] = useState(false);
    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const next =
                window.scrollY > lastScrollY &&
                window.scrollY > 50;
            setScrollingDown(prev =>
                prev !== next ? next : prev
            );
            lastScrollY = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });
        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, []);
    return scrollingDown;
}

export function useLinksFunction() {
    // const isLoggedIn = Boolean(user?.username?.trim() && user?.emailVerified);
    // const isGeneral = (user?.username?.trim());
    const pathname = usePathname();
    const activeKey = pathToKey[pathname] ?? null;
    const links = useMemo<LinkMeta[]>(() => {
        return [
            { Icon: CiShop, label: "Home", title: "Home", key: "Home", href: "/", },
            { Icon: CiSearch, label: "Search", title: "Search", key: "Search", href: "/search", },
            { Icon: CiCamera, label: "Post Work", title: "Post Work", key: "Post", href: "/post", },
            { Icon: CiSettings, label: "Settings", title: "Settings", key: "Settings", href: "/settings", },
            { Icon: CiUser, label: "Profile", title: "Profile", key: "Profile", href: "/profile", },
        ];

        // if (isGeneral) {
        //     links.push(
        //         { Icon: CiSettings, label: "Settings", title: "Settings", key: "Settings", href: "/settings", },
        //     );
        // }

        // if (isLoggedIn) {
        //     links.push(
        //         { Icon: CiCamera, label: "Post Work", title: "Post Work", key: "Post", href: "/post", },
        //     );
        // }

        // links.push({
        //     Icon: CiUser,
        //     label: isLoggedIn ? "Profile" : "Signin",
        //     title: isLoggedIn ? "Profile" : "Signin",
        //     key: isLoggedIn ? "Profile" : "Signin",
        //     href: isLoggedIn ? "/profile" : "/signin",
        // });

    }, [/* isLoggedIn */]);
    return {
        links,
        activeKey,
    };
}