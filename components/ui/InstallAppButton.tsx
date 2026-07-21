"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const STORAGE_KEY = "gyarchi-install-remind-at";
const REMIND_AFTER_DAYS = 7;

export default function InstallAppButton() {
  const shown = useRef(false);

  useEffect(() => {
    // Already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // iOS Safari
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone) {
      return;
    }

    const handler = (event: Event) => {
      event.preventDefault();

      // Reminder check
      const nextReminder = localStorage.getItem(STORAGE_KEY);

      if (nextReminder && Date.now() < Number(nextReminder)) {
        return;
      }

      if (shown.current) return;
      shown.current = true;

      const promptEvent = event as BeforeInstallPromptEvent;

      toast("Install GyArchi", {
        id: "install-gyarchi",
        description:
          "Install GyArchi for a faster, full-screen app experience.",
        duration: Infinity,

        action: {
          label: "Install",
          onClick: async () => {
            await promptEvent.prompt();

            const { outcome } = await promptEvent.userChoice;

            if (outcome === "accepted") {
              localStorage.removeItem(STORAGE_KEY);

              toast.success("GyArchi installed successfully.");
            } else {
              const remindAt =
                Date.now() +
                REMIND_AFTER_DAYS * 24 * 60 * 60 * 1000;

              localStorage.setItem(
                STORAGE_KEY,
                remindAt.toString()
              );
            }
          },
        },

        cancel: {
          label: "Later",
          onClick: () => {
            const remindAt =
              Date.now() +
              REMIND_AFTER_DAYS * 24 * 60 * 60 * 1000;

            localStorage.setItem(
              STORAGE_KEY,
              remindAt.toString()
            );
          },
        },
      });
    };

    const installed = () => {
      localStorage.removeItem(STORAGE_KEY);

      toast.dismiss("install-gyarchi");

      toast.success("Thanks for installing GyArchi!");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  return null;
}