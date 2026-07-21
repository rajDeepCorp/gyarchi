// components/settings/FacePic.tsx
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";

type FacePicProps = {
  user: {
    image?: string | null;
    name?: string | null;
    username?: string | null;
    dob?: string | null;
    bio?: string | null;
    mobile?: string | null;
    address?: string | null;
  };
};

const FacePic = ({ user }: FacePicProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image || "/1.jpg");
  const [name, setName] = useState(user.name || "");
  const [dob, setDob] = useState(user.dob || "");
  const [bio, setBio] = useState(user.bio || "");
  const [mobile, setMobile] = useState(user.mobile || "");
  const [address, setAddress] = useState(user.address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(user.image || "/1.jpg");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, user.image]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const updateField = async (
    field: string,
    value: string,
    originalValue?: string | null
  ) => {
    if (value === (originalValue ?? "")) return;

    const response = await fetch("/api/auth/update-social", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        field,
        value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${field}`);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      // Image Upload
      if (selectedFile) {
        const extension = selectedFile.name.split(".").pop();

        const fileName = `${user.username || user.name || "user"
          }-facepic.${extension}`;

        const uploaded = await upload(fileName, selectedFile, {
          access: "public",
          handleUploadUrl: "/api/imagefiles/upload",
        });

        const imageResponse = await fetch(
          "/api/auth/update-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: uploaded.url,
            }),
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Image upload failed");
        }
      }

      // Profile Updates
      await Promise.all([
        updateField("name", name, user.name),
        updateField("dob", dob, user.dob),
        updateField("bio", bio, user.bio),
        updateField("mobile", mobile, user.mobile),
        updateField("address", address, user.address),
      ]);

      toast.success("Profile updated successfully");

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  const mainDivStyles = "relative text-sm flex flex-col justify-center items-center gap-2"
  const subDivStyles = "flex w-xs flex-col justify-start gap-2"
  const labelStyles = "min-w-1/3 text-center py-1 px-2 shadow shadow-stone-500 rounded-2xl"
  const inputWraperStyles = "shadow shadow-stone-500 rounded-2xl w-10/12 px-2 py-1.5 items-center flex"
  const inputStyles = "mx-auto w-full shadow-inner shadow-stone-500 rounded-2xl px-2 outline-none"

  return (
    <details className="relative max-w-full min-w-xs shadow shadow-stone-500 px-4 py-2 m-1 rounded-4xl">
      <summary className="relative list-none cursor-pointer font-bold text-center">
        Profile
      </summary>

      <div className={`${mainDivStyles}`}>
        <div className="relative w-37.5 h-37.5 rounded-full overflow-hidden">
          <Image
            src={preview}
            alt="Profile Pic"
            fill
            className="rounded-full object-cover"
            sizes="150px"
          />
        </div>

        <div className={`${subDivStyles} items-start`}>
          <label htmlFor="profilePic" className={`${labelStyles}`}>Change Facepic</label>
          <div className={`${inputWraperStyles}`}>
            <input type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleFileChange}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      <div className={`${mainDivStyles} mt-4`}>
        <div className={`${subDivStyles} items-end`}>
          <label htmlFor="name" className={`${labelStyles}`}>Update Name</label>
          <div className={`${inputWraperStyles}`}>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              className={inputStyles}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${mainDivStyles} mt-4`}>
        <div className={`${subDivStyles} items-start`}>
          <label htmlFor="dob" className={`${labelStyles}`}>Update DOB</label>
          <div className={`${inputWraperStyles}`}>
            <input
              type="date"
              id="dob"
              placeholder="Date of Birth"
              className={inputStyles}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${mainDivStyles} mt-4`}>
        <div className={`${subDivStyles} items-end`}>
          <label htmlFor="bio" className={`${labelStyles}`}>Update Bio</label>
          <div className={`${inputWraperStyles}`}>
            <input
              type="text"
              id="bio"
              placeholder="Enter Bio"
              className={inputStyles}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${mainDivStyles} mt-4`}>
        <div className={`${subDivStyles} items-start`}>
          <label htmlFor="mobile" className={`${labelStyles}`}>Update Mobile</label>
          <div className={`${inputWraperStyles}`}>
            <input
              type="tel"
              id="mobile"
              placeholder="Enter Mobile No."
              className={inputStyles}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={`${mainDivStyles} mt-4`}>
        <div className={`${subDivStyles} items-end`}>
          <label htmlFor="address" className={`${labelStyles}`}>Update Address</label>
          <div className={`${inputWraperStyles}`}>
            <input
              type="text"
              id="address"
              placeholder="Enter Address"
              className={inputStyles}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-xs justify-center items-center mt-5">
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`${loading ? "opacity-50 cursor-not-allowed" : ""} "min-w-1/3 text-center py-1 shadow px-2 shadow-stone-500 rounded-2xl font-bold transition-all duration-150 ease-in hover:scale-105 active:scale-95"`}
        >
          {loading ? "Updating" : "Update"}
        </button>
      </div>
    </details>
  );
};

export default FacePic;