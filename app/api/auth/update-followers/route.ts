// app/api/auth/update-followers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

const client = new MongoClient(process.env.MONGODB_URI as string);

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

        const { userId, action } = await req.json();

        if (!userId || !["follow", "unfollow"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            );
        }

        await client.connect();

        const db = client.db();

        const currentUser = await db.collection("user").findOne({
            email: session.user.email,
        });

        const targetUser = await db.collection("user").findOne({
            _id: new ObjectId(userId),
        });

        if (!currentUser || !targetUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const currentUserId = currentUser._id.toString();
        const targetUserId = targetUser._id.toString();

        if (currentUserId === targetUserId) {
            return NextResponse.json(
                { error: "Cannot follow yourself" },
                { status: 400 }
            );
        }

        const followingRef = adminDb.ref(
            `following/${currentUserId}/${targetUserId}`
        );

        const followersRef = adminDb.ref(
            `followers/${targetUserId}/${currentUserId}`
        );

        const alreadyFollowing = await followingRef.get();

        if (action === "follow") {
            if (alreadyFollowing.exists()) {
                return NextResponse.json({
                    success: true,
                    following: true,
                });
            }

            await Promise.all([
                db.collection("user").updateOne(
                    { _id: targetUser._id },
                    {
                        $inc: {
                            followers: 1,
                        },
                    }
                ),

                db.collection("user").updateOne(
                    { _id: currentUser._id },
                    {
                        $inc: {
                            following: 1,
                        },
                    }
                ),

                followersRef.set({
                    userId: currentUserId,
                    name: currentUser.name,
                }),

                followingRef.set({
                    userId: targetUserId,
                    name: targetUser.name,
                }),
            ]);

            return NextResponse.json({
                success: true,
                following: true,
            });
        }

        if (!alreadyFollowing.exists()) {
            return NextResponse.json({
                success: true,
                following: false,
            });
        }

        await Promise.all([
            db.collection("user").updateOne(
                { _id: targetUser._id },
                {
                    $inc: {
                        followers: -1,
                    },
                }
            ),

            db.collection("user").updateOne(
                { _id: currentUser._id },
                {
                    $inc: {
                        following: -1,
                    },
                }
            ),

            followersRef.remove(),

            followingRef.remove(),
        ]);

        return NextResponse.json({
            success: true,
            following: false,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { following: false },
                { status: 401 }
            );
        }

        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { following: false },
                { status: 400 }
            );
        }

        const currentUserId = session.user.id;

        const snapshot = await adminDb
            .ref(`following/${currentUserId}/${userId}`)
            .get();

        return NextResponse.json({
            following: snapshot.exists(),
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { following: false },
            { status: 500 }
        );
    }
}