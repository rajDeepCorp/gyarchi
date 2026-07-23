// components/ui/ArtworkViewer.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CiPlay1, CiPause1 } from "react-icons/ci";

type Props = {
  children: React.ReactNode;
  isVideo?: boolean;
};

export default function ArtworkViewer({ children, isVideo = false }: Props) {
  const [showUI, setShowUI] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const centerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCenterTimer = () => {
    if (centerTimerRef.current) {
      clearTimeout(centerTimerRef.current);
      centerTimerRef.current = null;
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

  // Video ke actual play/pause state ko track karo
  useEffect(() => {
    if (!isVideo) return;

    const video = document.querySelector("video");
    if (!video) return;

    // Initial state set karo
    setIsPaused(video.paused);
    if (video.paused) {
      setShowCenterIcon(true);
    }

    const handlePlay = () => {
      setIsPaused(false);
      // Playing hote hi icon flash karo, fir jaldi hide
      clearCenterTimer();
      setShowCenterIcon(true);
      centerTimerRef.current = setTimeout(() => {
        setShowCenterIcon(false);
      }, 500);
    };

    const handlePause = () => {
      setIsPaused(true);
      // Paused hone par icon hamesha dikhna chahiye
      clearCenterTimer();
      setShowCenterIcon(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      clearCenterTimer();
    };
  }, [isVideo]);

  const handleTap = () => {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
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
      {/* Center Play/Pause Icon */}
      {isVideo && (
        <div
          className={`pointer-events-none fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-5xl text-white transition-opacity duration-150 ${
            showCenterIcon ? "opacity-100" : "opacity-0"
          }`}
        >
          {isPaused ? <CiPlay1 /> : <CiPause1 />}
        </div>
      )}

      {/* Rest of the UI */}
      <div
        className={`absolute inset-0 z-50 transition-opacity duration-300 ${
          showUI
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}