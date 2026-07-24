// app/(user)/edit/[artwork]/page.tsx

"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface PostData {
  id: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: "image" | "video";
  title: string;
  description: string;
  tags: string[];
  username: string;
}

export default function EditPostPage() {
  const { artwork } = useParams<{ artwork: string }>();
  const router = useRouter();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${artwork}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load post.");
        }

        setPost(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTags(Array.isArray(data.tags) ? data.tags : []);
      } catch (err) {
        console.error(err);
        toast("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    if (artwork) fetchPost();
  }, [artwork]);

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

  const handleSave = async () => {
    if (!post) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post.");
      }

      toast("Post updated successfully!");
      router.push(`/art/${post.id}`);
    } catch (err) {
      console.error(err);
      toast("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="relative shadow-inner shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center items-center py-10">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative shadow-inner shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center items-center py-10">
        Post not found.
      </div>
    );
  }

  return (
    <div className="relative shadow-inner shadow-stone-500 p-2 m-1 rounded-4xl">

      {/* Preview (read-only, media can't be changed) */}
      <div className="relative shadow shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center">

        {post.mediaType === "video" ? (
          <video
            src={post.mediaUrl}
            controls
            playsInline
            muted
            className="rounded-3xl max-h-180"
          />
        ) : (
          <Image
            src={post.mediaUrl}
            width={720}
            height={720}
            alt="Preview"
            className="rounded-3xl object-cover"
          />
        )}

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

      {/* Save Button */}
      <div className="relative shadow mt-2 shadow-stone-500 p-2 m-1 rounded-4xl flex justify-center items-center gap-2">
        <button
          onClick={() => router.back()}
          disabled={saving}
          className="px-5 py-2 rounded-l-4xl shadow shadow-stone-500 disabled:opacity-50 disabled:shadow-inner"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-r-4xl shadow shadow-stone-500 disabled:opacity-50 disabled:shadow-inner"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}