"use client";

import { useEffect } from "react";

function installNagishLiOptionAriaGuard() {
  const optionProto = window.HTMLOptionElement?.prototype;
  const originalSetAttribute = Element.prototype.setAttribute;
  const originalSetAttributeNS = Element.prototype.setAttributeNS;

  const sanitize = (root: ParentNode = document) => {
    root.querySelectorAll("option[aria-hidden='true']").forEach((option) => {
      option.removeAttribute("aria-hidden");
    });
  };

  Element.prototype.setAttribute = function patchedSetAttribute(
    qualifiedName: string,
    value: string,
  ) {
    if (
      this instanceof HTMLOptionElement &&
      qualifiedName === "aria-hidden" &&
      value === "true"
    ) {
      return;
    }

    return originalSetAttribute.call(this, qualifiedName, value);
  };

  Element.prototype.setAttributeNS = function patchedSetAttributeNS(
    namespace: string | null,
    qualifiedName: string,
    value: string,
  ) {
    if (
      this instanceof HTMLOptionElement &&
      qualifiedName === "aria-hidden" &&
      value === "true"
    ) {
      return;
    }

    return originalSetAttributeNS.call(this, namespace, qualifiedName, value);
  };

  if (optionProto) {
    const descriptor = Object.getOwnPropertyDescriptor(optionProto, "ariaHidden");

    if (!descriptor || descriptor.configurable) {
      Object.defineProperty(optionProto, "ariaHidden", {
        configurable: true,
        enumerable: descriptor?.enumerable ?? false,
        get() {
          return this.getAttribute("aria-hidden");
        },
        set(value) {
          if (String(value) === "true") {
            this.removeAttribute("aria-hidden");
            return;
          }

          if (value == null || value === "") {
            this.removeAttribute("aria-hidden");
            return;
          }

          originalSetAttribute.call(this, "aria-hidden", String(value));
        },
      });
    }
  }

  const observer = new MutationObserver(() => {
    sanitize(document);
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["aria-hidden"],
  });

  sanitize(document);

  return () => {
    observer.disconnect();
    Element.prototype.setAttribute = originalSetAttribute;
    Element.prototype.setAttributeNS = originalSetAttributeNS;
    sanitize(document);
  };
}

function appendInlineScript(id: string, code: string) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.text = code;
  document.body.appendChild(script);
}

function appendExternalScript(id: string, src: string) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.defer = true;
  script.async = true;
  script.charset = "utf-8";
  document.body.appendChild(script);
}

export function AccessibilityControls() {
  useEffect(() => {
    let cancelled = false;
    const restoreOptionAriaGuard = installNagishLiOptionAriaGuard();

    const bootNagishLi = () => {
      if (cancelled) {
        return;
      }

      appendInlineScript(
        "nagishli-config",
        `
          window.nagishli_config = {
            color: "brown",
            language: "he"
          };
        `,
      );

      appendExternalScript(
        "nagishli-script",
        "/nagishli/nagishli_beta.js?v=3.0b-20260329-hardcoded",
      );

      appendInlineScript(
        "nagishli-visibility-fix",
        `
          (() => {
            const ensureNagishliReady = () => {
              const trigger = document.getElementById("NagishLiTrigger");
              const widget = document.getElementById("NagishLiWidget");

              if (trigger instanceof HTMLElement) {
                trigger.style.display = "inline-block";
                trigger.style.visibility = "visible";
                trigger.style.opacity = "1";
                trigger.style.zIndex = "95";
              }

              if (widget instanceof HTMLElement) {
                widget.style.zIndex = "94";
              }
            };

            let attempts = 0;
            const interval = window.setInterval(() => {
              ensureNagishliReady();
              attempts += 1;
              if (document.getElementById("NagishLiTrigger") || attempts > 40) {
                window.clearInterval(interval);
              }
            }, 250);

            ensureNagishliReady();
          })();
        `,
      );
    };

    const scheduleBoot = () => {
      const timeoutId = window.setTimeout(bootNagishLi, 2500);
      return () => window.clearTimeout(timeoutId);
    };

    let cleanupDelay: (() => void) | undefined;

    if (document.readyState === "complete") {
      cleanupDelay = scheduleBoot();
    } else {
      const onLoad = () => {
        cleanupDelay = scheduleBoot();
      };

      window.addEventListener("load", onLoad, { once: true });

      return () => {
        cancelled = true;
        window.removeEventListener("load", onLoad);
        cleanupDelay?.();
        restoreOptionAriaGuard();
      };
    }

    return () => {
      cancelled = true;
      cleanupDelay?.();
      restoreOptionAriaGuard();
    };
  }, []);

  return null;
}
