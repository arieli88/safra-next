import Script from "next/script";

export function AccessibilityControls() {
  return (
    <>
      <Script
        id="nagishli-guard"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const originalWarn = window.console.warn.bind(window.console);
              const originalLog = window.console.log.bind(window.console);
              const originalError = window.console.error.bind(window.console);
              const originalSetAttribute = Element.prototype.setAttribute;
              const originalSetAttributeNS = Element.prototype.setAttributeNS;
              const optionProto = window.HTMLOptionElement?.prototype;
              const ariaHiddenDescriptor = optionProto
                ? Object.getOwnPropertyDescriptor(optionProto, "ariaHidden")
                : undefined;

              const shouldIgnoreNagishLiJqueryMessage = (args) =>
                Array.isArray(args) &&
                args.some(
                  (value) =>
                    typeof value === "string" &&
                    value.includes("NagishLi") &&
                    value.includes("jQuery"),
                );

              const sanitizeOptions = (root = document) => {
                root.querySelectorAll('option[aria-hidden="true"]').forEach((option) => {
                  option.removeAttribute("aria-hidden");
                });
              };

              const patchConsoleMethod = (originalMethod) => (...args) => {
                if (shouldIgnoreNagishLiJqueryMessage(args)) {
                  return;
                }

                originalMethod(...args);
              };

              window.console.warn = patchConsoleMethod(originalWarn);
              window.console.log = patchConsoleMethod(originalLog);
              window.console.error = patchConsoleMethod(originalError);

              Element.prototype.setAttribute = function(name, value) {
                if (this instanceof HTMLOptionElement && name === "aria-hidden" && String(value) === "true") {
                  return;
                }

                return originalSetAttribute.call(this, name, value);
              };

              Element.prototype.setAttributeNS = function(namespace, name, value) {
                if (this instanceof HTMLOptionElement && name === "aria-hidden" && String(value) === "true") {
                  return;
                }

                return originalSetAttributeNS.call(this, namespace, name, value);
              };

              if (optionProto && (!ariaHiddenDescriptor || ariaHiddenDescriptor.configurable)) {
                Object.defineProperty(optionProto, "ariaHidden", {
                  configurable: true,
                  enumerable: ariaHiddenDescriptor?.enumerable ?? false,
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

              const observer = new MutationObserver(() => {
                sanitizeOptions(document);
              });

              observer.observe(document.documentElement, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["aria-hidden"],
              });

              window.__safraNagishLiCleanup = () => {
                sanitizeOptions(document);
              };

              sanitizeOptions(document);
            })();
          `,
        }}
      />
      <Script
        id="nagishli-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.nagishli_config = {
              color: "brown",
              language: "he"
            };
          `,
        }}
      />
      <Script
        id="nagishli-script"
        src="/nagishli/nagishli_beta.js?v=3.0b-20260329-hardcoded"
        strategy="afterInteractive"
        charSet="utf-8"
      />
      <Script
        id="nagishli-visibility-fix"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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

                if (typeof window.__safraNagishLiCleanup === "function") {
                  window.__safraNagishLiCleanup();
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

              if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", ensureNagishliReady, { once: true });
              } else {
                ensureNagishliReady();
              }
            })();
          `,
        }}
      />
    </>
  );
}
