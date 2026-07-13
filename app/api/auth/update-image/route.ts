import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

const client = new MongoClient(
  process.env.MONGODB_URI as string
);

export async function POST(req: Request) {
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

    const { image } = await req.json();

    const db = client.db();

    const existingUser = await db
      .collection("user")
      .findOne({
        email: session.user.email,
      });

    const oldImage = existingUser?.image;

    await db.collection("user").updateOne(
      {
        email: session.user.email,
      },
      {
        $set: {
          image,
        },
      }
    );

    if (oldImage && oldImage !== image) {
      try {
        await del(oldImage);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}