// app/(user)/post/page.tsx

"use client";

import Image from "next/image";
import React, { useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";

export default function PostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("/1.jpg");
  const [isVideo, setIsVideo] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const generateVideoThumbnail = (videoFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(videoFile);

      video.onloadeddata = () => {
        video.currentTime = 0;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(video, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Thumbnail generation failed"));
              return;
            }

            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };

      video.onerror = reject;
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);

    setPreview(url);

    setIsVideo(selectedFile.type.startsWith("video/"));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image or video.");
      return;
    }

    try {
      setUploading(true);

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const fileName = `${slug}-${Date.now()}.${extension}`;

      const blob = await upload(fileName, file, {
        access: "public",
        handleUploadUrl: "/api/imagefiles/upload",
      });

      const mediaUrl = blob.url;
      let thumbnailUrl: string | null = null;

      if (isVideo) {
        const thumbnailBlob = await generateVideoThumbnail(file);

        const thumbnailFile = new File(
          [thumbnailBlob],
          `${slug}-thumbnail-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        const thumbnailUpload = await upload(
          thumbnailFile.name,
          thumbnailFile,
          {
            access: "public",
            handleUploadUrl: "/api/imagefiles/upload",
          }
        );

        thumbnailUrl = thumbnailUpload.url;
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaUrl,
          thumbnailUrl,
          mediaType: isVideo ? "video" : "image",
          title,
          description,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save post.");
      }

      toast("Post uploaded successfully!");

      setFile(null);
      setPreview("/1.jpg");
      setIsVideo(false);
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
    } catch (err) {
      console.error(err);
      toast("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative shadow-inner shadow-stone-500 p-2 m-1 rounded-4xl">

      {/* Preview */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center">

        {isVideo ? (
          <video
            src={preview}
            controls
            playsInline
            muted
            className="rounded-3xl max-h-180"
          />
        ) : (
          <Image
            src={preview}
            width={720}
            height={720}
            alt="Preview"
            className="rounded-3xl object-cover"
          />
        )}

      </div>

      {/* File Input */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />
      </div>

      {/* Title */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl">
        <input
          type="text"
          placeholder="Artwork Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Description */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl">
        <textarea
          placeholder="Artwork Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full outline-none resize-none"
          rows={4}
        />
      </div>

      {/* Tags */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl">

        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="px-3 py-1 rounded-full shadow shadow-stone-500 text-sm hover:opacity-80"
            >
              #{tag} ✕
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Type a tag and press Tab / Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" ||
              e.key === "Tab" ||
              e.key === ","
            ) {
              e.preventDefault();
              addTag();
            }

            if (
              e.key === "Backspace" &&
              tagInput === "" &&
              tags.length > 0
            ) {
              setTags((prev) => prev.slice(0, -1));
            }
          }}
          className="w-full outline-none"
        />

      </div>

      {/* Upload Button */}
      <div className="relative shadow mt-2 shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center items-center">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-5 py-2 rounded-4xl shadow shadow-stone-500 disabled:opacity-50 disabled:shadow-inner"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

    </div>
  );
}