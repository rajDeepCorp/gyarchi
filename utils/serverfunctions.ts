// utils/sessionfunctions.ts

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { CiCamera, CiSearch, CiSettings, CiShop, CiUser, } from "react-icons/ci";
import { authClient } from "@/lib/auth-client";

type NavKey = | "Home" | "Search" | "Post" | "Settings" | "Profile" | "Signin";
type LinkMeta = { Icon: IconType; label: string; title: string; key: NavKey; href: string; };
const pathToKey: Record<string, NavKey> = {
    "/": "Home", "/search": "Search", "/post": "Post", "/settings": "Settings", "/profile": "Profile", "/signin": "Signin", "/signup": "Signin",
};

export function useLinksFunction() {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const user = session?.user ?? null;
    const isLoggedIn = Boolean(user?.username?.trim() && user?.emailVerified);
    const isGeneral = (user?.username?.trim());
    const isGuest = Boolean(user?.username?.trim() || user?.emailVerified || user?.email);

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
            label: isGuest ? "Profile" : "Signin",
            title: isGuest ? "Profile" : "Signin",
            key: isGuest ? "Profile" : "Signin",
            href: isGuest ? "/profile" : "/signin",
        });

        return items;
    }, [isLoggedIn, isGeneral, isGuest]);

    return {
        links,
        activeKey,
    };
};

