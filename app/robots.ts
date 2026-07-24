// app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/settings",
                    "/messages",
                    "/post",
                    "/profile",
                    "/resetpassword",
                    "/signin",
                    "/signup",
                ],
            },
        ],
        sitemap: `${"https://www.gyarchi.com"}/sitemap.xml`,
        host: "https://www.gyarchi.com",
    };
}