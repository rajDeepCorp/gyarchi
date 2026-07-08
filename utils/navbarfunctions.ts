// utils/navbarfunctions.ts


import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { CiCamera, CiSearch, CiSettings, CiShop, CiUser, } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";

type NavKey = | "Home" | "Search" | "Post" | "Settings" | "Profile" | "Signin";
type LinkMeta = { Icon: IconType; label: string; title: string; key: NavKey; href: string; };
const pathToKey: Record<string, NavKey> = {
    "/": "Home", "/search": "Search", "/post": "Post", "/settings": "Settings", "/profile": "Profile", "/signin": "Signin", "/signup": "Signin",
};

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
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const user = session?.user as
        | { username?: string; emailVerified: boolean; image?: string | null; name: string; email: string; } | null;

    const isLoggedIn = Boolean(
        user?.username?.trim() &&
        user?.emailVerified
    );

    const isGeneral = Boolean(user?.username?.trim());
    const activeKey = pathToKey[pathname] ?? null;
    const links = useMemo<LinkMeta[]>(() => {
        const items: LinkMeta[] = [
            { Icon: CiShop, label: "Home", title: "Home", key: "Home", href: "/", },
            { Icon: CiSearch, label: "Search", title: "Search", key: "Search", href: "/search", },
        ];
        if (isLoggedIn) {
            items.push({ Icon: CiCamera, label: "Post Work", title: "Post Work", key: "Post", href: "/post", });
        }
        if (isGeneral) {
            items.push({ Icon: CiSettings, label: "Settings", title: "Settings", key: "Settings", href: "/settings", });
        }
        items.push({
            Icon: CiUser,
            label: isLoggedIn ? "Profile" : "Signin",
            title: isLoggedIn ? "Profile" : "Signin",
            key: isLoggedIn ? "Profile" : "Signin",
            href: isLoggedIn ? "/profile" : "/signin",
        });

        return items;
    }, [isLoggedIn, isGeneral]);

    return {
        links,
        activeKey,
    };
}