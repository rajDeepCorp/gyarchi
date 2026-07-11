// utils/signupfunctions.ts

import React, { useState } from "react";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";
import { authClient } from '@/lib/auth-client';
import { useRouter } from "next/navigation";

const initialForm = { name: "", email: "", username: "", password: "", mobile: "", dob: "", };
type SignupData = { name: string; email: string; password: string; username: string; mobile: string; dob: string; image?: string; callbackURL?: string; };

export function useSignupFunction() {
    const router = useRouter();
    const [formData, setFormData] = useState(initialForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp",];
        const file = e.target.files?.[0];
        if (!file) { setSelectedFile(null); return; }
        if (file.size > 2 * 1024 * 1024) {
            toast.warning("File size must be less than 2MB");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }
        if (!allowed.includes(file.type)) {
            toast.warning("Image format not allowed");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }
        setSelectedFile(file);

    };

    const uploadProfilePic = async (): Promise<string | null> => {
        if (!selectedFile) return null;
        const extension =
            selectedFile.name.split(".").pop() || "jpg";
        const safeUsername = formData.username
            .trim()
            .replace(/^@+/, "")
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, "");
        const fileName = `${safeUsername}-facepic.${extension}`;
        const uploaded = await upload(fileName, selectedFile, {
            access: "public",
            handleUploadUrl: "/api/imagefiles/upload",
        });
        return uploaded?.url ?? null;
    };

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> {
        e.preventDefault();
        const { name, email, password, mobile, dob, } = formData;
        const cleanUsername = formData.username
            .trim()
            .replace(/^@+/, "");
        if (
            !name.trim() ||
            !email.trim() ||
            !cleanUsername ||
            !password.trim() ||
            !mobile.trim() ||
            !dob.trim()
        ) {
            toast.warning("Please fill all required fields");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.warning("Please enter a valid email address");
            return;
        }
        if (!/^\d{10}$/.test(mobile)) {
            toast.warning("Please enter a valid 10-digit mobile number");
            return;
        }
        if (password.length < 8) {
            toast.warning("Password must be at least 8 characters");
            return;
        }
        const selectedDate = new Date(dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            toast.warning("Date of birth cannot be in the future");
            return;
        }

        const username = `@${cleanUsername}`;
        const loadingToast = toast.loading("Creating account...");
        setLoading(true);
        try {
            const checkResponse = await fetch("/api/auth/check-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                }),
            });

            if (!checkResponse.ok) {
                throw new Error("Failed to verify user");
            }

            const checkData = await checkResponse.json();

            if (checkData.emailExists) {
                toast.error("Email already registered");
                return;
            }

            if (checkData.usernameExists) {
                toast.error("Username already taken");
                return;
            }

            let imageUrl = "";

            if (selectedFile) {
                const uploadedUrl = await uploadProfilePic();

                if (!uploadedUrl) {
                    throw new Error("Image upload failed");
                }

                imageUrl = uploadedUrl;
            }

            const signupData: SignupData = {
                name,
                email,
                password,
                username,
                mobile,
                dob,
                image: imageUrl,
                callbackURL: "/profile",
            };

            const { error } = await authClient.signUp.email(
                signupData as any,
                {
                    onSuccess: () => {
                        router.push("/profile");
                    },
                }
            );

            if (error) {
                if (imageUrl) {
                    await fetch("/api/imagefiles/delete", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pathname: imageUrl,
                        }),
                    });
                }

                toast.error(error.message || "Signup failed");
                return;
            }

            toast.success("Account created successfully");

            setFormData(initialForm);
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    }
    return {
        formData,
        selectedFile,
        setSelectedFile,
        loading,
        handleChange,
        uploadProfilePic,
        handleSubmit,
        handleFileChange,
    };
}