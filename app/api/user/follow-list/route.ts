// app/api/user/follow-list/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

const client = new MongoClient(process.env.MONGODB_URI as string);

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const currentUserId = session?.user.id ?? null;

        const userId = req.nextUrl.searchParams.get("userId");
        const type = req.nextUrl.searchParams.get("type");

        if (!userId || !["followers", "following"].includes(type || "")) {
            return NextResponse.json(
                { error: "Invalid request" },
                { status: 400 }
            );
        }

        await client.connect();

        const db = client.db();

        const ref = adminDb.ref(`${type}/${userId}`);
        const snapshot = await ref.get();

        if (!snapshot.exists()) {
            return NextResponse.json({
                users: [],
            });
        }

        const data = snapshot.val();
        const ids = Object.keys(data);

        const mongoUsers = await db
            .collection("user")
            .find({
                _id: {
                    $in: ids.map((id) => new ObjectId(id)),
                },
            })
            .project({
                name: 1,
                username: 1,
                dob: 1,
            })
            .toArray();

        const users = await Promise.all(
            mongoUsers.map(async (user) => {
                let age: number | null = null;

                if (user.dob) {
                    const dob = new Date(user.dob);
                    const today = new Date();

                    age = today.getFullYear() - dob.getFullYear();

                    const month = today.getMonth() - dob.getMonth();

                    if (
                        month < 0 ||
                        (month === 0 &&
                            today.getDate() < dob.getDate())
                    ) {
                        age--;
                    }
                }

                let following = false;

                if (
                    currentUserId &&
                    currentUserId !== user._id.toString()
                ) {
                    const followSnapshot = await adminDb
                        .ref(
                            `following/${currentUserId}/${user._id.toString()}`
                        )
                        .get();

                    following = followSnapshot.exists();
                }

                return {
                    userId: user._id.toString(),
                    username: user.username ?? "",
                    name: user.name,
                    age,
                    following,
                };
            })
        );

        return NextResponse.json({
            users,
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