"use client";

import { useEffect } from "react";

import { AccessibilityControls } from "@/components/site/accessibility-controls";
import { loadGoogleAnalytics } from "@/lib/third-party-loader";

const GOOGLE_ANALYTICS_DELAY_MS = 4000;

export function ThirdPartyScriptManager() {
  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = () => {
      if (cancelled) {
        return;
      }

      void loadGoogleAnalytics();
      detachListeners();
    };

    const timerId = window.setTimeout(
      loadAnalytics,
      GOOGLE_ANALYTICS_DELAY_MS,
    );

    const interactionEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "scroll",
      "keydown",
    ];
    const detachListeners = () => {
      window.clearTimeout(timerId);
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, loadAnalytics);
      });
      window.removeEventListener(
        "safra:consent-granted",
        loadAnalytics as EventListener,
      );
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, loadAnalytics, {
        once: true,
        passive: true,
      });
    });

    window.addEventListener("safra:consent-granted", loadAnalytics as EventListener, {
      once: true,
    });

    return () => {
      cancelled = true;
      detachListeners();
    };
  }, []);

  return <AccessibilityControls />;
}
