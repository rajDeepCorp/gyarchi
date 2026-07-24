// app/sitemap.ts

import type { MetadataRoute } from "next";
import { adminDb } from "@/firebaseAdmin";
import { db } from "@/lib/auth";

const BASE_URL = "https://www.gyarchi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.5,
        },
    ];

    // Dynamic artwork pages (Firebase Realtime DB)
    let artworkRoutes: MetadataRoute.Sitemap = [];
    try {
        const postsSnapshot = await adminDb.ref("posts").get();
        if (postsSnapshot.exists()) {
            const data = postsSnapshot.val();
            artworkRoutes = Object.keys(data).map((id) => ({
                url: `${BASE_URL}/art/${id}`,
                lastModified: data[id]?.createdAt
                    ? new Date(data[id].createdAt)
                    : new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error("Sitemap: failed to fetch posts", error);
    }

    // Dynamic user profile pages (MongoDB - better-auth "user" collection)
    let userRoutes: MetadataRoute.Sitemap = [];
    try {
        const users = await db
            .collection("user")
            .find(
                { username: { $exists: true, $ne: null } },
                { projection: { username: 1, updatedAt: 1 } }
            )
            .toArray();

        userRoutes = users
            .filter((u) => !!u.username)
            .map((u) => ({
                url: `${BASE_URL}/${encodeURIComponent(u.username)}`,
                lastModified: u.updatedAt ? new Date(u.updatedAt) : new Date(),
                changeFrequency: "weekly",
                priority: 0.6,
            }));
    } catch (error) {
        console.error("Sitemap: failed to fetch users", error);
    }

    return [...staticRoutes, ...artworkRoutes, ...userRoutes];
}