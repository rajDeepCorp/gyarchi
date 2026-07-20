// app/api/follow/route.ts

import { adminDb } from "@/firebaseAdmin";
import { auth, db } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { targetUserId } = await request.json();

        if (!targetUserId) {
            return NextResponse.json(
                { error: "Target user is required." },
                { status: 400 }
            );
        }

        if (targetUserId === session.user.id) {
            return NextResponse.json(
                { error: "You can't follow yourself." },
                { status: 400 }
            );
        }

        const currentUser = await db.collection("user").findOne({
            id: session.user.id,
        });

        const targetUser = await db.collection("user").findOne({
            id: targetUserId,
        });

        if (!currentUser || !targetUser) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const followingRef = adminDb.ref(
            `follows/${session.user.id}/following/${targetUserId}`
        );

        const alreadyFollowing = await followingRef.get();

        if (alreadyFollowing.exists()) {
            return NextResponse.json(
                { error: "Already following." },
                { status: 400 }
            );
        }

        const updates: Record<string, boolean> = {};

        updates[
            `follows/${session.user.id}/following/${targetUserId}`
        ] = true;

        updates[
            `follows/${targetUserId}/followers/${session.user.id}`
        ] = true;

        await adminDb.ref().update(updates);

        await db.collection("user").updateOne(
            { id: session.user.id },
            {
                $inc: {
                    followingCount: 1,
                },
            }
        );

        await db.collection("user").updateOne(
            { id: targetUserId },
            {
                $inc: {
                    followersCount: 1,
                },
            }
        );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { targetUserId } = await request.json();

        if (!targetUserId) {
            return NextResponse.json(
                { error: "Target user is required." },
                { status: 400 }
            );
        }

        const followingRef = adminDb.ref(
            `follows/${session.user.id}/following/${targetUserId}`
        );

        const alreadyFollowing = await followingRef.get();

        if (!alreadyFollowing.exists()) {
            return NextResponse.json(
                { error: "Not following this user." },
                { status: 400 }
            );
        }

        const updates: Record<string, null> = {};

        updates[
            `follows/${session.user.id}/following/${targetUserId}`
        ] = null;

        updates[
            `follows/${targetUserId}/followers/${session.user.id}`
        ] = null;

        await adminDb.ref().update(updates);

        await db.collection("user").updateOne(
            { id: session.user.id },
            {
                $inc: {
                    followingCount: -1,
                },
            }
        );

        await db.collection("user").updateOne(
            { id: targetUserId },
            {
                $inc: {
                    followersCount: -1,
                },
            }
        );

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}