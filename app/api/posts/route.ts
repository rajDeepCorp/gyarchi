// app/api/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

export async function POST(req: NextRequest) {

    try {

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            imageUrl,
            title,
            description,
            tags,
        } = await req.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image is required" },
                { status: 400 }
            );
        }

        const ref = adminDb.ref("posts");

        await ref.push({
            imageUrl,
            username: session.user.username,
            title: title || "",
            description: description || "",
            tags: Array.isArray(tags) ? tags : [],
            likes: 0,
            likedBy: {},
            saves: 0,
            savedBy: {},
            got: 0,
            gotBy: {},
            createdAt: Date.now(),
        });

        return NextResponse.json({
            success: true,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}