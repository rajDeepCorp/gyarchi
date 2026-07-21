"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const styles = {
    formContainer:
        "relative w-10/12 text-shadow-sm text-shadow-stone-500 flex sm:flex-row flex-col justify-start sm:items-start gap-2 p-2",
    shortLabel:
        "relative px-5 py-0.5 shadow rounded-2xl shadow-stone-500 sm:text-end text-start",
    input:
        "relative outline-none shadow-inner shadow-stone-500 rounded-2xl px-2 w-full text-shadow-2xs text-shadow-stone-500",
    inputWrapper:
        "relative px-5 py-1 shadow rounded-2xl shadow-stone-500 flex gap-4",
};

type Props = {
    token: string;
};

const NewPasswordForm = ({ token }: Props) => {
    const router = useRouter();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.warning("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const loadingToast = toast.loading(
            "Updating password..."
        );

        try {
            setLoading(true);

            const { error } = await authClient.resetPassword({
                token,
                newPassword,
            });

            toast.dismiss(loadingToast);

            if (error) {
                toast.error(
                    error.message || "Password reset failed"
                );
                return;
            }

            toast.success("Password updated successfully");

            router.push("/signin");
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
                Create New Password
            </p>

            <form
                onSubmit={handleSubmit}
                className="relative w-11/12 max-w-2xl mx-auto flex flex-col justify-center items-center border-b"
            >
                {/* New Password */}
                <div className={`${styles.formContainer} items-start`}>
                    <label
                        htmlFor="newPassword"
                        className={styles.shortLabel}
                    >
                        Password
                    </label>

                    <div className={styles.inputWrapper}>
                        <input
                            required
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            placeholder="Enter New Password"
                            className={styles.input}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className={`${styles.formContainer} items-start`}>
                    <label
                        htmlFor="confirmPassword"
                        className={styles.shortLabel}
                    >
                        Confirm
                    </label>

                    <div className={styles.inputWrapper}>
                        <input
                            required
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            className={styles.input}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
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
                        ? "Updating..."
                        : "Update Password"}
                </button>
            </form>
        </div>
    );
};

export default NewPasswordForm;