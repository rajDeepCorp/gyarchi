// app/api/follow/status/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    following: false,
                },
                {
                    status: 200,
                }
            );
        }

        const targetUserId =
            request.nextUrl.searchParams.get("targetUserId");

        if (!targetUserId) {
            return NextResponse.json(
                {
                    error: "Target user is required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (targetUserId === session.user.id) {
            return NextResponse.json({
                following: false,
            });
        }

        const snapshot = await adminDb
            .ref(`follows/${session.user.id}/following/${targetUserId}`)
            .get();

        return NextResponse.json({
            following: snapshot.exists(),
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