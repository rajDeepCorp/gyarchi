// components/ui/ArtworkMedia.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  artworkId: string; // unique key ke liye
};

export default function ArtworkMedia({ src, artworkId }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    // Cleanup: component unmount ya artworkId change hone par
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load(); // decoder ko fully release karta hai
      }
    };
  }, [artworkId]);

  return (
    <video
      key={artworkId}
      ref={videoRef}
      src={src}
      autoPlay
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-contain"
    />

  );
}