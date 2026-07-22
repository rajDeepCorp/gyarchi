// components/ui/ArtworkViewer.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ArtworkViewer({ children }: Props) {
  const [showUI, setShowUI] = useState(true);
  const [isHolding, setIsHolding] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startHideTimer = useCallback(() => {
    clearHideTimer();

    timerRef.current = setTimeout(() => {
      if (!isHolding) {
        setShowUI(false);
      }
    }, 3000);
  }, [isHolding]);

  useEffect(() => {
    startHideTimer();

    return () => {
      clearHideTimer();
    };
  }, [startHideTimer]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    }
    setShowUI(true);
    if (!isHolding) {
      startHideTimer();
    }
  };

  const handlePointerDown = () => {
    setIsHolding(true);
    setShowUI(true);
    clearHideTimer();
  };

  const handlePointerUp = () => {
    setIsHolding(false);
    setShowUI(true);
    startHideTimer();
  };

  return (
    <div
      className="relative h-full w-full"
      onClick={handleTap}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-300 ${showUI
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        {children}
      </div>
    </div>
  );
}