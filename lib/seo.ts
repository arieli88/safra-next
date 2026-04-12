import type { Metadata } from "next";

import type { SiteContent } from "@/lib/types";

import { getSiteUrl } from "./site-url";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

type JsonLdNode = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

const SITE_NAME = "\u05d1\u05d9\u05ea \u05de\u05d3\u05e8\u05e9 \u05e1\u05e4\u05e8\u05d0";
const TEL_AVIV_JAFFA = "\u05ea\u05dc \u05d0\u05d1\u05d9\u05d1-\u05d9\u05e4\u05d5";

function getAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  return new URL(path, `${siteUrl}/`).toString();
}

function getEmailAddress(mailtoOrEmail: string) {
  return mailtoOrEmail.replace(/^mailto:/i, "");
}

function getTelephone(content: SiteContent) {
  return content.contactPage.lecturers.find((lecturer) => !lecturer.hidden)?.phone ?? "";
}

export function createPageMetadata({ title, description, path = "/", keywords = [] }: PageSeoInput): Metadata {
  const absoluteUrl = getAbsoluteUrl(path);
  const socialImage = getAbsoluteUrl("/og-image.jpg");
  const titleWithBrand = path === "/" ? title : `${title} | ${SITE_NAME}`;

  return {
    title: titleWithBrand,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: titleWithBrand,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      locale: "he_IL",
      type: "website",
      images: [
        {
          url: socialImage,
          secureUrl: socialImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleWithBrand,
      description,
      images: [socialImage],
    },
  };
}

export function buildOrganizationJsonLd(content: SiteContent) {
  const email = getEmailAddress(content.meta.email);
  const telephone = getTelephone(content);
  const sameAs = [content.meta.instagramUrl, content.meta.facebookUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": getAbsoluteUrl("/#organization"),
    name: content.nav.title,
    url: getAbsoluteUrl("/"),
    description: content.meta.description,
    logo: getAbsoluteUrl("/icons/icon-512.png"),
    image: getAbsoluteUrl("/og-image.jpg"),
    email,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.meta.address,
      addressLocality: TEL_AVIV_JAFFA,
      addressCountry: "IL",
    },
    sameAs,
  };
}

export function buildWebsiteJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": getAbsoluteUrl("/#website"),
    url: getAbsoluteUrl("/"),
    name: content.nav.title,
    description: content.meta.description,
    inLanguage: "he-IL",
  };
}

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": getAbsoluteUrl("/#faq"),
    mainEntity: [
      {
        "@type": "Question",
        name: "מה זה בית מדרש ספרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "בית מדרש ספרא הוא בית מדרש קהילתי בלב תל אביב המיועד לחיילים, חיילות, בנות שירות ובני שירות לאומי, דתיים וחילונים, המחפשים לימוד, חיבור וקהילה בזמן השירות הצבאי או הלאומי.",
        },
      },
      {
        "@type": "Question",
        name: "למי מתאים בית מדרש ספרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "בית המדרש מתאים לחיילים וחיילות, בנות שירות ובני שירות לאומי, וכן לבוגרי ישיבות ומדרשות במהלך שירותם.",
        },
      },
      {
        "@type": "Question",
        name: "האם צריך ידע קודם בלימוד תורה או גמרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן, בדרך כלל נדרש רקע בסיסי בלימוד גמרא. המפגשים בנויים ללומדים שכבר חוו לימוד במסגרת ישיבה, מדרשה או מכינה.",
        },
      },
      {
        "@type": "Question",
        name: "איפה נמצא בית מדרש ספרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "בית מדרש ספרא ממוקם בבית אמונה, דרך השלום 11, תל אביב. 5 דקות הליכה מתחנת רכבת השלום.",
        },
      },
      {
        "@type": "Question",
        name: "מתי מתקיימים השיעורים?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "השיעורים מתקיימים פעמיים בשבוע: יום ראשון ויום רביעי בין השעות 19:00–21:45.",
        },
      },
      {
        "@type": "Question",
        name: "מה לומדים בבית מדרש ספרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "הלימוד מתמקד בעיקר בגמרא, לצד לימוד תורה, הלכה ומחשבת ישראל, בשילוב חברותות, שיעורים ושיח פתוח.",
        },
      },
      {
        "@type": "Question",
        name: "איך נראה ערב בבית מדרש ספרא?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "הערב כולל לימוד גמרא וחברותות, שיעור מרכזי, שיח קהילתי וארוחת ערב קלה משותפת באווירה פתוחה ומשמעותית.",
        },
      },
      {
        "@type": "Question",
        name: "האם מתאים גם לחיילים אחרי יום שירות אינטנסיבי?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן. בית המדרש נבנה במיוחד עבור חיילים וחיילות, כולל כאלה המגיעים לאחר יום שירות עמוס, למשל בתפקידי מודיעין ומטה, ומחפשים מקום של חיבור ולימוד.",
        },
      },
      {
        "@type": "Question",
        name: "האם יש גם מרכיב חברתי בבית המדרש?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן. מעבר ללימוד, המקום יוצר קהילה קבועה, חברותות וקשרים חברתיים משמעותיים בין המשתתפים.",
        },
      },
      {
        "@type": "Question",
        name: "האם אפשר להגיע לשיעור ניסיון?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "כן. ניתן להצטרף לשיעורים ללא התחייבות. הכניסה חינם!",
        },
      },
    ],
  };
}

export function buildPlaceJsonLd(content: SiteContent) {
  const email = getEmailAddress(content.meta.email);
  const telephone = getTelephone(content);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": getAbsoluteUrl("/contact#place"),
    name: content.footer.title,
    description: content.contactPage.description,
    url: getAbsoluteUrl("/contact"),
    image: getAbsoluteUrl("/og-image.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: content.meta.address,
      addressLocality: TEL_AVIV_JAFFA,
      addressCountry: "IL",
    },
    telephone,
    email,
    hasMap: content.contactPage.mapEmbedUrl,
    openingHoursSpecification: content.contactPage.hours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      description: hours,
    })),
  };
}

export function stringifyJsonLd(jsonLd: JsonLdNode) {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
