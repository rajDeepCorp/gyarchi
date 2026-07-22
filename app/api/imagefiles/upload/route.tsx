// app/api/imagefiles/upload/route.tsx

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        const body = (await request.json()) as HandleUploadBody;

        const jsonResponse = await handleUpload({
            body,
            request,

            onBeforeGenerateToken: async () => {

                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/webp",

                        // Videos
                        "video/mp4",
                        "video/webm",
                        "video/quicktime", // .mov
                    ],

                    tokenPayload: JSON.stringify({}),

                    addRandomSuffix: true,

                    access: "public",
                };
            },

            onUploadCompleted: async ({
                blob,
                tokenPayload,
            }) => {

                console.log(
                    "Blob upload completed",
                    blob,
                    tokenPayload
                );

                try {

                } catch (error) {

                    console.error(error);

                    throw new Error(
                        "Could not update user after upload"
                    );
                }
            },
        });

        return NextResponse.json(jsonResponse);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            {
                status: 400,
            }
        );
    }
}