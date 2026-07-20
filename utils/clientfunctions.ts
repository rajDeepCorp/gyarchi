// utils/clientfunctions.ts

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { CiCamera, CiSearch, CiSettings, CiShop, CiUser, } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";

export function useLinksFunction() {
    type NavKey = | "Home" | "Search" | "Post" | "Settings" | "Profile" | "Signin";
    type LinkMeta = { Icon: IconType; label: string; title: string; key: NavKey; href: string; };
    const pathToKey: Record<string, NavKey> = {
        "/": "Home", "/search": "Search", "/post": "Post", "/settings": "Settings", "/profile": "Profile", "/signin": "Signin", "/signup": "Signin",
    };
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    type User = { email?: string | null; username?: string | null; emailVerified?: boolean; };
    const user = session?.user as User | undefined;
    const isArtist = Boolean(user?.username?.trim() && user?.emailVerified);
    const isGeneral = Boolean(user?.username?.trim());
    const isGuest = Boolean(user?.username?.trim() || user?.emailVerified || user?.email);

    const activeKey = pathToKey[pathname] ?? null;
    const links = useMemo<LinkMeta[]>(() => {
        const items: LinkMeta[] = [
            { Icon: CiShop, label: "Home", title: "Home", key: "Home", href: "/", },
            { Icon: CiSearch, label: "Search", title: "Search", key: "Search", href: "/search", },
        ];
        if (isArtist) {
            items.push({ Icon: CiCamera, label: "Post Work", title: "Post Work", key: "Post", href: "/post", });
        }
        items.push({
            Icon: CiUser,
            label: isGuest ? "Profile" : "Signin",
            title: isGuest ? "Profile" : "Signin",
            key: isGuest ? "Profile" : "Signin",
            href: isGuest ? "/profile" : "/signin",
        });

        return items;
    }, [isArtist, isGeneral, isGuest,]);
    return { links,
    activeKey,
    isArtist,
    isGeneral,
    isGuest, };
}

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