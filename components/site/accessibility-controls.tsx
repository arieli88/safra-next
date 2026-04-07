import Script from "next/script";

export function AccessibilityControls() {
  return (
    <>
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
