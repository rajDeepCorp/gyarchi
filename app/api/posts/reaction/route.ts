// app/api/posts/reaction/route.ts

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { adminDb } from "@/firebaseAdmin";

type ReactionType = "like" | "save" | "got";

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

    const { postId, type } = (await req.json()) as {
      postId: string;
      type: ReactionType;
    };

    if (!postId || !type) {
      return NextResponse.json(
        { error: "Missing postId or type." },
        { status: 400 }
      );
    }

    const reactionMap = {
      like: {
        count: "likes",
        users: "likedBy",
        alwaysIncrement: false,
      },
      save: {
        count: "saves",
        users: "savedBy",
        alwaysIncrement: true, // save counter kabhi decrement nahi hoga
      },
      got: {
        count: "got",
        users: "gotBy",
        alwaysIncrement: false,
      },
    };

    const reaction = reactionMap[type];

    if (!reaction) {
      return NextResponse.json(
        { error: "Invalid reaction type." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const postRef = adminDb.ref(`posts/${postId}`);

    const result = await postRef.transaction((post) => {
      if (!post) return post;

      if (!post[reaction.users]) {
        post[reaction.users] = {};
      }

      const reacted = !!post[reaction.users][userId];

      if (reaction.alwaysIncrement) {
        // Save: har click pe count hamesha badhega, kabhi ghategaa nahi.
        // savedBy sirf "kabhi save kiya tha ya nahi" track karne ke liye rahega
        // (UI me heart-fill jaisa reacted state dikhane ke liye), lekin
        // uske hone/na hone se count par koi asar nahi padega.
        post[reaction.users][userId] = true;
        post[reaction.count] = (post[reaction.count] || 0) + 1;
      } else {
        if (reacted) {
          delete post[reaction.users][userId];

          post[reaction.count] = Math.max(
            (post[reaction.count] || 0) - 1,
            0
          );
        } else {
          post[reaction.users][userId] = true;

          post[reaction.count] =
            (post[reaction.count] || 0) + 1;
        }
      }

      return post;
    });

    if (!result.committed) {
      return NextResponse.json(
        { error: "Transaction failed." },
        { status: 500 }
      );
    }

    const updatedPost = result.snapshot.val();

    return NextResponse.json({
      success: true,

      count: updatedPost[reaction.count],

      reacted:
        !!updatedPost[reaction.users]?.[userId],
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