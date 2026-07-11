// app/api/auth/check-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(
process.env.MONGODB_URI as string
);

export async function POST(req: NextRequest) {

try {

    const {
        email,
        username,
    } = await req.json();

    await client.connect();

    const db = client.db();

    const emailUser =
        await db.collection("user")
            .findOne({ email });

    const usernameUser =
        await db.collection("user")
            .findOne({ username });

    return NextResponse.json({
        emailExists: !!emailUser,
        usernameExists: !!usernameUser,
    });

} catch (error) {

    console.error(error);

    return NextResponse.json(
        {
            error: true,
        },
        {
            status: 500,
        }
    );
}

}