// components/settings/FacePic.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useSignupFunction } from "@/utils/signupfunctions";

type FacePicProps = {
  user: {
    image?: string | null;
    name?: string | null;
    username?: string | null;
  };
};

const FacePic = ({ user }: FacePicProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image || "/1.jpg");
  const { loading } = useSignupFunction();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(user.image || "/1.jpg");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, user.image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const file = selectedFile;
    try {
      const extension = file.name.split(".").pop();

      const fileName = `${user.username || user.name || "user"
        }-facepic.${extension}`;

      const uploaded = await upload(fileName, file, {
        access: "public",
        handleUploadUrl: "/api/imagefiles/upload",
      });

      const response = await fetch("/api/auth/update-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploaded.url,
        }),
      });

      if (response.ok) {
        toast.success("Profile image updated");
        window.location.reload();
      } else {
        console.error("Failed to update profile image.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <details className="relative max-w-full min-w-xs shadow shadow-stone-500 px-4 py-2 m-1 rounded-4xl">
      <summary className="relative list-none cursor-pointer font-bold text-center">
        Profile
      </summary>

      <div
        className="relative text-sm flex flex-col justify-center items-center gap-2">
        <div className="relative w-37.5 h-37.5 rounded-full overflow-hidden">
          <Image
            src={preview}
            alt="Profile Pic"
            fill
            className="rounded-full object-cover"
            sizes="150px"
          />
        </div>

        <div className={`flex w-xs flex-col justify-start gap-2 items-start`}>
          <label htmlFor="profilePic" className="min-w-1/3 text-center py-1 px-2 shadow shadow-stone-500 rounded-2xl">Profile Pic</label>
          <div className="shadow shadow-stone-500 rounded-2xl w-10/12 px-2 py-1.5 items-center flex">
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleFileChange}
              className="mx-auto w-full shadow-inner shadow-stone-500 rounded-2xl px-2 outline-none"
            />
          </div>
        </div>

        <div className="flex w-xs justify-center items-center">
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`${loading ? "opacity-50 cursor-not-allowed" : ""} "min-w-1/3 text-center py-1 shadow px-2 shadow-stone-500 rounded-2xl font-bold transition-all duration-150 ease-in hover:scale-105 active:scale-95"`}
          >
            {loading ? "Updating" : "Update"}
          </button>
        </div>

      </div>
    </details>
  );
};

export default FacePic;