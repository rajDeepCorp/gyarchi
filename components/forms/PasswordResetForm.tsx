// components/forms/PasswordResetForm.tsx

"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const styles = {
    formContainer: "relative w-10/12 text-shadow-sm text-shadow-stone-500 flex sm:flex-row flex-col justify-start sm:items-start gap-2 p-2",
    shortLabel: "relative px-5 py-0.5 shadow rounded-2xl shadow-stone-500 sm:text-end text-start",
    input: "relative outline-none shadow-inner shadow-stone-500 rounded-2xl px-2 w-full text-shadow-2xs text-shadow-stone-500",
    inputWrapper: "relative px-5 py-1 shadow rounded-2xl shadow-stone-500 flex gap-4",
};

const PasswordResetForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.warning("Please enter your email");
            return;
        }

        const loadingToast = toast.loading(
            "Sending reset link..."
        );

        try {
            setLoading(true);

            const { error } =
                await authClient.requestPasswordReset({
                    email,
                    redirectTo: `${window.location.origin}/resetpassword`,
                });

            toast.dismiss(loadingToast);

            if (error) {
                toast.error(
                    error.message || "Failed to send reset link"
                );
                return;
            }

            toast.success(
                "Password reset link sent to your email"
            );

            setEmail("");
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full text-sm flex flex-col justify-center items-center gap-6 my-2">
            <p className="relative text-xl">
                Reset your password
            </p>

            <form
                onSubmit={handleSubmit}
                className="relative w-11/12 max-w-2xl mx-auto flex flex-col justify-center items-center border-b"
            >
                {/* Email */}
                <div className={`${styles.formContainer} items-start`}>
                    <label
                        htmlFor="email"
                        className={styles.shortLabel}
                    >
                        Email
                    </label>

                    <div className={styles.inputWrapper}>
                        <input
                            required
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            className={styles.input}
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`${loading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } relative mb-2 max-w-2xs rounded-2xl shadow shadow-stone-500 text-shadow-sm text-shadow-stone-500 py-1 px-5 transition-all duration-150 ease-in hover:scale-105 active:scale-95`}
                >
                    {loading
                        ? "Sending..."
                        : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
};

export default PasswordResetForm;