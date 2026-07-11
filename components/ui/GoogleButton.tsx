// components/ui/GoogleButton.tsx
"use client";
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react'
import { toast } from 'sonner';

const GoogleButton = () => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignUp = async () => {
        const loadingToast = toast.loading("Redirecting to Google...");
        try {
            setLoading(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/profile",
            });

            toast.dismiss(loadingToast);

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Google Signin Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button

            onClick={handleGoogleSignUp}
            type="submit"
            aria-label="Sign in with Google"
            className="max-w-3xs text-center py-1 shadow px-8 shadow-stone-500 rounded-2xl font-bold"
        >
            {loading ? "Signing In..." : "Google"}
        </button>
    )
}

export default GoogleButton
