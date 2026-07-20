// app/(user)/post/page.tsx

"use client";
import Image from "next/image";
import React, { useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";

export default function PostPage() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState("/1.jpg");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImage(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image.");
      return;
    }

    try {
      setUploading(true);

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/imagefiles/upload",
      });

      const imageUrl = blob.url;

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
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
      setImage("/1.jpg");
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

      {/* Image Preview */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center">
        <Image
          src={image}
          width={720}
          height={720}
          alt="Preview"
          className="rounded-3xl object-cover"
        />
      </div>

      {/* File Input */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
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