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
            mediaUrl,
            thumbnailUrl,
            mediaType,
            title,
            description,
            tags,
        } = await req.json();

        if (!mediaUrl) {
            return NextResponse.json(
                { error: "Media is required" },
                { status: 400 }
            );
        }

        if (
            mediaType !== "image" &&
            mediaType !== "video"
        ) {
            return NextResponse.json(
                { error: "Invalid media type" },
                { status: 400 }
            );
        }

        if (mediaType === "video" && !thumbnailUrl) {
            return NextResponse.json(
                { error: "Video thumbnail is required" },
                { status: 400 }
            );
        }

        const ref = adminDb.ref("posts");

        await ref.push({
            mediaUrl,
            thumbnailUrl: thumbnailUrl || null,
            mediaType,
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

export async function DELETE(req: NextRequest) {
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

        const { postId } = (await req.json()) as { postId: string };

        if (!postId) {
            return NextResponse.json(
                { error: "postId is required" },
                { status: 400 }
            );
        }

        const postRef = adminDb.ref(`posts/${postId}`);
        const snapshot = await postRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const post = snapshot.val();

        // Ownership check — sirf apna hi post delete kar sakte ho
        if (post.username !== session.user.username) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // Blob storage se media delete karo (media + thumbnail agar ho)
        const { del } = await import("@vercel/blob");
        const urlsToDelete = [post.mediaUrl, post.thumbnailUrl].filter(
            (url): url is string => !!url
        );

        if (urlsToDelete.length > 0) {
            try {
                await del(urlsToDelete);
            } catch (blobError) {
                // Blob delete fail ho jaye to bhi DB se post hataana zaroori hai
                console.error("Blob delete error:", blobError);
            }
        }

        // Firebase se post entry delete karo
        await postRef.remove();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}