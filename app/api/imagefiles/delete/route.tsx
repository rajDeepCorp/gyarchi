// app/api/imagefiles/delete/route.tsx

import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

type DeleteRequestBody = {
    pathname: string;
};

export async function POST(request: NextRequest) {

    try {

        const body = (await request.json()) as DeleteRequestBody;

        const { pathname } = body;

        if (!pathname) {

            return NextResponse.json(
                {
                    error: "No pathname provided",
                },
                {
                    status: 400,
                }
            );
        }

        await del(pathname);

        return NextResponse.json({
            ok: true,
            message: "Image deleted successfully",
        });

    } catch (error) {

        console.error("Delete API error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}