// app/api/auth/update-social/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";

const client = new MongoClient(
  process.env.MONGODB_URI as string
);

const allowedFields = [
  "name",
  "dob",
  "address",
  "bio",
  "facebook",
  "instagram",
  "youtube",
  "twitter",
  "linkedin",
  "github",
  "website",
] as const;

type SocialField = (typeof allowedFields)[number];

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

    const { field, value } = await req.json();

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    await client.connect();

    const db = client.db();

    await db.collection("user").updateOne(
      {
        email: session.user.email,
      },
      {
        $set: {
          [field as SocialField]: value.trim(),
        },
      }
    );

    return NextResponse.json({
      success: true,
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