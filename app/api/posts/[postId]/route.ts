// app/api/posts/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;

        const postRef = adminDb.ref(`posts/${postId}`);
        const snapshot = await postRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: postId,
            ...snapshot.val(),
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
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

        const { postId } = await params;
        const { title, description, tags } = await req.json();

        const postRef = adminDb.ref(`posts/${postId}`);
        const snapshot = await postRef.get();

        if (!snapshot.exists()) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const post = snapshot.val();

        // Ownership check — sirf apna hi post edit kar sakte ho
        if (post.username !== session.user.username) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await postRef.update({
            title: title ?? post.title ?? "",
            description: description ?? post.description ?? "",
            tags: Array.isArray(tags) ? tags : post.tags ?? [],
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}