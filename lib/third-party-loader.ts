"use client";

declare global {
  interface Window {
    __safraManagedScripts__?: Map<string, Promise<void>>;
    nagishli_config?: {
      color?: string;
      language?: string;
    };
    $?: unknown;
    jQuery?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __safraGoogleAnalyticsLoaded__?: boolean;
  }
}

type ScriptConfig = {
  key: string;
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
};

const NAGISHLI_STORAGE_KEY = "safra:nagishli-opened";
const GOOGLE_ANALYTICS_ID = "G-ZZ2SSDV73R";
const JQUERY_CDN_URL = "https://code.jquery.com/jquery-3.7.1.min.js";

function suppressNagishLiJqueryNotice() {
  const originalConsoleWarn = window.console.warn.bind(window.console);
  const originalConsoleLog = window.console.log.bind(window.console);

  const shouldIgnore = (args: unknown[]) =>
    args.some(
      (value) =>
        typeof value === "string" &&
        value.includes("NagishLi") &&
        value.includes("jQuery"),
    );

  window.console.warn = (...args: Parameters<typeof console.warn>) => {
    if (shouldIgnore(args)) {
      return;
    }

    originalConsoleWarn(...args);
  };

  window.console.log = (...args: Parameters<typeof console.log>) => {
    if (shouldIgnore(args)) {
      return;
    }

    originalConsoleLog(...args);
  };

  return () => {
    window.console.warn = originalConsoleWarn;
    window.console.log = originalConsoleLog;
  };
}

function suppressInvalidOptionAriaHidden() {
  const originalSetAttribute = Element.prototype.setAttribute;

  Element.prototype.setAttribute = function setAttributePatched(
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

  return () => {
    Element.prototype.setAttribute = originalSetAttribute;
  };
}

function sanitizeNagishLiMarkup(root: ParentNode = document) {
  root.querySelectorAll("option[aria-hidden='true']").forEach((option) => {
    option.removeAttribute("aria-hidden");
  });
}

function getManagedScriptsRegistry() {
  if (!window.__safraManagedScripts__) {
    window.__safraManagedScripts__ = new Map<string, Promise<void>>();
  }

  return window.__safraManagedScripts__;
}

function loadManagedScript({
  key,
  id,
  src,
  async = true,
  defer = true,
  attributes = {},
}: ScriptConfig) {
  const registry = getManagedScriptsRegistry();
  const existingPromise = registry.get(key);
  if (existingPromise) {
    return existingPromise;
  }

  const existingScript = document.getElementById(id) as HTMLScriptElement | null;
  if (existingScript?.dataset.loaded === "true") {
    return Promise.resolve();
  }

  const promise = new Promise<void>((resolve) => {
    const script = existingScript ?? document.createElement("script");

    script.id = id;
    script.src = src;
    script.async = async;
    script.defer = defer;

    for (const [name, value] of Object.entries(attributes)) {
      script.setAttribute(name, value);
    }

    const handleLoad = () => {
      script.dataset.loaded = "true";
      resolve();
    };

    const handleError = () => {
      registry.delete(key);
      console.warn(`Script failed to load (ignored): ${src}`);
      resolve();
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  registry.set(key, promise);
  return promise;
}

function waitForElement(id: string, attempts = 40, intervalMs = 125) {
  return new Promise<HTMLElement>((resolve, reject) => {
    const existingElement = document.getElementById(id);
    if (existingElement instanceof HTMLElement) {
      resolve(existingElement);
      return;
    }

    let currentAttempt = 0;
    const intervalId = window.setInterval(() => {
      const element = document.getElementById(id);
      if (element instanceof HTMLElement) {
        window.clearInterval(intervalId);
        resolve(element);
        return;
      }

      currentAttempt += 1;
      if (currentAttempt >= attempts) {
        window.clearInterval(intervalId);
        reject(new Error(`Element #${id} was not found.`));
      }
    }, intervalMs);
  });
}

function markNagishLiAsUsed() {
  try {
    window.localStorage.setItem(NAGISHLI_STORAGE_KEY, "true");
  } catch {}
}

export function hasUsedNagishLiBefore() {
  try {
    return window.localStorage.getItem(NAGISHLI_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export async function loadNagishLi() {
  document.documentElement.dataset.nagishliCustomTrigger = "enabled";
  window.nagishli_config = {
    ...window.nagishli_config,
    color: "brown",
    language: "he",
  };

  const restoreConsolePatch = suppressNagishLiJqueryNotice();
  const restoreAriaPatch = suppressInvalidOptionAriaHidden();

  try {
    if (!window.jQuery || !window.$) {
      await loadManagedScript({
        key: "jquery",
        id: "jquery-script",
        src: JQUERY_CDN_URL,
      });
    }

    await loadManagedScript({
      key: "nagishli",
      id: "nagishli-script",
      src: "/nagishli/nagishli_beta.js?v=3.0b-20260329-hardcoded",
      attributes: {
        charset: "utf-8",
      },
    });

    const widget = await waitForElement("NagishLiWidget").catch(() => null);
    if (widget instanceof HTMLElement) {
      widget.style.zIndex = "94";
      sanitizeNagishLiMarkup(widget);
    }

    const trigger = await waitForElement("NagishLiTrigger");
    sanitizeNagishLiMarkup(document);
    return trigger;
  } finally {
    window.setTimeout(() => {
      sanitizeNagishLiMarkup(document);
      restoreAriaPatch();
      restoreConsolePatch();
    }, 1500);
  }
}

export async function openNagishLi() {
  const trigger = await loadNagishLi();
  markNagishLiAsUsed();
  trigger.click();
}

function hasAnalyticsConsent() {
  const consentState = document.documentElement.dataset.analyticsConsent;
  if (consentState === "granted") {
    return true;
  }

  if (consentState === "denied") {
    return false;
  }

  return null;
}

export async function loadGoogleAnalytics() {
  if (window.__safraGoogleAnalyticsLoaded__) {
    return;
  }

  const consent = hasAnalyticsConsent();
  if (consent === false) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_ID);

  await loadManagedScript({
    key: "google-analytics",
    id: "google-analytics-script",
    src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
  });

  window.__safraGoogleAnalyticsLoaded__ = true;
}
