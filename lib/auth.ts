// lib/auth.ts

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { resend } from "./resend";

const client = new MongoClient(
    process.env.MONGODB_URI as string
);
export const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,

        async sendResetPassword({ user, url }) {
            const result = await resend.emails.send({
                from: process.env.EMAIL_FROM as string,
                to: user.email,
                subject: "Reset your TATTOOMI password",
                html: `
                    <div style="font-family:Arial,sans-serif;padding:24px;">
                        <h2>TATTOOMI</h2>
                        <p>Hello ${user.name ?? "Artist"},</p>
                        <p>We received a request to reset your password.</p>
                        <p>Click the button below to create a new password.</p>
                        <p style="margin:30px 0;">
                            <a href="${url}" style="background:#111827;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;">
                                Reset Password
                            </a>
                        </p>

                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `,
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
    },

    user: {
        additionalFields: {
            username: { type: "string", required: false, },
            mobile: { type: "string", required: false, },
            dob: { type: "string", required: false, },
            followers: { type: "number", required: false, },
            following: { type: "number", required: false, },
            image: { type: "string", required: false, },
            address: { type: "string", required: false, },
            bio: { type: "string", required: false, },
            facebook: { type: "string", required: false, },
            instagram: { type: "string", required: false, },
            youtube: { type: "string", required: false, },
            twitter: { type: "string", required: false, },
            linkedin: { type: "string", required: false, },
            website: { type: "string", required: false, },
        },
    },
});