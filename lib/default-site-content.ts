import type { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  meta: {
    title: "בית מדרש ספרא | לימוד תורה ושיח באמונה לחיילים בתל אביב",
    description:
      "בית מדרש ספרא הוא מרחב של לימוד, שיח וחיבור לחיילים ולחיילות בלב תל אביב. שיעורי תורה, תוכן ערכי וקהילה.",
    keywords: ["בית מדרש", "ספרא", "חיילים", "חיילות", "תל אביב", "לימוד תורה", "קהילה"],
    ogImage: "https://lh3.googleusercontent.com/d/1XViuDW6CK3DTuoGjzKZu1iKoJoHNmfIB",
    logoUrl: "https://lh3.googleusercontent.com/d/1nR2S5uUgQOdB4Y9CsNhqzAUv7u19GTGv",
    address: "בית אמונה, דרך השלום 11, תל אביב",
    email: "mailto:info@safra.org.il",
    resourcesLink: "https://drive.google.com/drive/folders/1VerAkXvv7LTz3SoGuzgo1dNwcm8GGoz2",
    instagramUrl: "https://www.instagram.com/beit_midrash_safra/",
    facebookUrl:
      "https://www.facebook.com/people/%D7%91%D7%99%D7%AA-%D7%9E%D7%93%D7%A8%D7%A9-%D7%A1%D7%A4%D7%A8%D7%90/61564644059378/?rdid=8CtXqyGP9Fd0J18s&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ddk9k3nah%2F",
  },
  nav: {
    title: "בית מדרש ספרא",
    subtitle: "לימוד, קהילה וחיבור בתל אביב",
    links: [
      { label: "אודות", href: "/#about" },
      { label: "הקהילה", href: "/#community" },
      { label: "היסטוריה", href: "/#history" },
      { label: "תמונות", href: "/#gallery" },
      { label: "חומרים", href: "https://drive.google.com/drive/folders/1VerAkXvv7LTz3SoGuzgo1dNwcm8GGoz2", external: true },
      { label: "צרו קשר", href: "/contact" },
    ],
  },
  ticker: [
    { id: "1", text: "עדכון שבועי לדוגמה: יום א' 19:00, שיעורי ספרא בבית אמונה." },
    { id: "2", text: "עדכון שבועי לדוגמה: יום ד' 19:00, לימוד, ארוחת ערב ושיח בגובה העיניים." },
    { id: "3", text: "עדכון שבועי לדוגמה: הצטרפו לקבוצת ה-WhatsApp לקבלת אירועים ועדכונים." },
  ],
  hero: {
    eyebrow: "ספרא",
    title: "ספרא - זה הזמן לעצור רגע. ללמוד. להתחבר.",
    body: "בית מדרש ספרא - רגע של נשמה באמצע השירות.\nמקום של לימוד, שיח וחיבור לחיילים ולחיילות בלב תל אביב.",
    ctaLabel: "גלו עוד על ספרא",
    ctaHref: "#about",
    ctaHidden: false,
    secondaryCtaLabel: "פגשו את המרצים שלנו",
    secondaryCtaHref: "/contact",
    secondaryCtaHidden: false,
    infoEyebrow: "רגע של נשמה באמצע השירות",
    infoCards: [
      {
        id: "resources",
        eyebrow: "חומרים",
        title: "גישה מהירה לקבצים ולתכנים",
        href: "https://drive.google.com/drive/folders/1VerAkXvv7LTz3SoGuzgo1dNwcm8GGoz2",
        hidden: false,
      },
      {
        id: "contact",
        eyebrow: "צרו קשר",
        title: "מרצים, זמנים ודרכי הגעה",
        href: "/contact",
        hidden: false,
      },
    ],
    images: [
      { src: "https://lh3.googleusercontent.com/d/1o_vg_ynx1lYzv7z14Jt2ZhfXW8S_rI9a", alt: "חיילים לומדים תורה" },
      { src: "https://lh3.googleusercontent.com/d/19aWd1EDMkg9H3SqCfKMq_QIMmXUhOcjF", alt: "תפילה ולימוד" },
      { src: "https://lh3.googleusercontent.com/d/1_Gi8jLN1LrUr83VT2p_jg5SL_zlJs--C", alt: "סיור בעקבות לימוד" },
    ],
  },
  about: {
    eyebrow: "בית מדרש ספרא",
    title: "מה זה בית מדרש ספרא?",
    body:
      'בית מדרש "ספרא" הוא מקום פתוח לחיילות ולחיילים - דתיים, חילונים וכולם באמצע - שמחפשים רגע של משמעות, חיבור וקהילה. המפגשים מתקיימים בלב תל אביב וכוללים לימוד, ארוחת ערב טובה ושיח בגובה העיניים. בואו לטעום משהו אחר, אנושי ואמיתי.',
    cardEyebrow: "רוח המקום",
    cardTitle: "לימוד, שיחה וקהילה במקום אחד",
    cardBody:
      "בית המדרש פועל כמקום מזמין ואמיתי, עם שיח פתוח, תוכן משמעותי ואווירה שמרגישה כמו בית לחיבור, למפגש וללימוד",
    addressLabel: "כתובת",
    addressText: "בית אמונה, דרך השלום 11, תל אביב",
  },
  community: {
    eyebrow: "בית מדרש ספרא",
    title: "הצטרפו לקהילה שלנו",
    footnote: "הצטרפו לקבוצת WhatsApp שלנו וקבלו עדכונים על שיעורים, אירועים ופעילויות",
    lecturersCtaLabel: "פגשו את המרצים שלנו",
    lecturersCtaHref: "/contact",
    tracks: [
      {
        id: "safra",
        title: "שיעורי ספרא",
        subtitle: "לימוד תורני עמוק",
        schedule: "יום א' ויום ד' | 19:00",
        description: "לימוד מעמיק בתורה, הלכה ומחשבה יהודית.\nמתאים לכל הרמות.",
        flyerImage: {
          src: "https://lh3.googleusercontent.com/d/1Z01knIC1KuBeXetVBSJjGLv1bqH79MfB",
          alt: "פלייר בית מדרש ספרא",
        },
        whatsappLabel: "הצטרפו לקבוצת WhatsApp - ספרא",
        whatsappUrl: "https://chat.whatsapp.com/DMV15UY08BO9HC5TkbbBT2",
      },
    ],
  },
  history: {
    eyebrow: "בית מדרש ספרא",
    title: "היסטוריית המקום",
    body:
      "בית המדרש הוקם באלול תשפ\"ג מתוך רצון לתת מענה לימודי, רוחני וחברתי לחיילים ולחיילות המשרתים בגוש דן.\nלצד סדרי לימוד אישיים וקבועים מתקיימים בו שיעורים, הרצאות וסדנאות מגוונות, ובמהלך המפגשים מוגשת ארוחת ערב ומתקיימת דינמיקה חברתית פתוחה ומגבשת.",
    media: [
      {
        id: "history-1",
        image: {
          src: "https://lh3.googleusercontent.com/d/1bZa1ikor1nygXpqgg6K_yP4ICxrdaPDD",
          alt: "לימוד בבית המדרש",
        },
      },
      {
        id: "history-2",
        image: {
          src: "https://lh3.googleusercontent.com/d/1UH9dvuGELr4Wmijb61Y72scMsa8WJeoF",
          alt: "מפגש קהילתי בבית המדרש",
        },
      },
      {
        id: "history-3",
        image: {
          src: "https://lh3.googleusercontent.com/d/1X5vAV4dA3cxIXcOpfEf3hznRZoRr99Nq",
          alt: "כתבה על בית מדרש ספרא",
        },
        linkLabel: "כתבה - מקור ראשון",
        linkHref: "https://www.makorrishon.co.il/culture/764299/",
      },
    ],
  },
  gallery: {
    eyebrow: "בית מדרש ספרא",
    title: "תמונות נוספות",
    description: "רגעים מתוך הלימוד, המפגשים והקהילה של בית מדרש ספרא.",
    carousels: [
      {
        id: "main-gallery",
        title: "גלריית ספרא",
        description: "מבחר תמונות מהשיעורים, הערבים המשותפים והמפגשים.",
        images: [
          { src: "https://lh3.googleusercontent.com/d/1qBC36Th2bGv0-l0_sA-U5qAH9vGZuwtl", alt: "שיעור בבית מדרש ספרא" },
          { src: "https://lh3.googleusercontent.com/d/1Od9hYhTHI6r2HSc7-NanOcdaAzEOx2PQ", alt: "משתתפים במפגש לימוד" },
          { src: "https://lh3.googleusercontent.com/d/1eQ-SdsoRyXlimsVMAS3vMSI1xcQ7FGOG", alt: "שיח קבוצתי בבית המדרש" },
          { src: "https://lh3.googleusercontent.com/d/19aWd1EDMkg9H3SqCfKMq_QIMmXUhOcjF", alt: "תפילה ולימוד בספרא" },
          { src: "https://lh3.googleusercontent.com/d/1R5uvb8YN6LldBAHbdpJXT03Z0ZZ30GDx", alt: "קהילת ספרא במפגש ערב" },
        ],
      },
    ],
  },
  footer: {
    title: "בית מדרש ספרא",
    address: "בית אמונה, דרך השלום 11, תל אביב",
    quickLinks: [
      { label: "אודות", href: "/#about" },
      { label: "היסטוריה", href: "/#history" },
      { label: "הקהילה", href: "/#community" },
      { label: "תמונות", href: "/#gallery" },
      { label: "צרו קשר", href: "/contact" },
    ],
    socialLinks: [
      { label: "אינסטגרם", href: "https://www.instagram.com/beit_midrash_safra/", external: true },
      {
        label: "פייסבוק",
        href: "https://www.facebook.com/people/%D7%91%D7%99%D7%AA-%D7%9E%D7%93%D7%A8%D7%A9-%D7%A1%D7%A4%D7%A8%D7%90/61564644059378/?rdid=8CtXqyGP9Fd0J18s&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ddk9k3nah%2F",
        external: true,
      },
      { label: 'דוא"ל', href: "mailto:info@safra.org.il" },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.336213450721!2d34.79492181527942!3d32.07222548098015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ba20dda7edd%3A0x4173467d204229b9!2sHaShalom%20Rd%2011%2C%20Tel%20Aviv-Jaffa!5e0!3m2!1sen!2sil!4v1700000000000!5m2!1sen!2sil",
    copyright: "© 2026 בית מדרש ספרא. כל הזכויות שמורות.",
  },
  contactPage: {
    eyebrow: "בית מדרש ספרא",
    title: "פרטי יצירת קשר עם המרצים",
    description: "כאן תוכלו ליצור קשר עם צוות בית המדרש, לקבל מענה מהיר, לראות שעות פעילות ולקבל דרכי הגעה בלחיצה אחת.",
    backLabel: "חזרה לעמוד הבית",
    cardSettings: {
      imageBlurPx: 8,
      tiltStrength: 2,
      spotlightEnabled: true,
      mobileColumns: "2",
    },
    lecturers: [
      {
        id: "momi",
        name: "הרב מומי פאלוך",
        phone: "050-9326926",
        program: "שיעורי ספרא",
        bio: "למד בישיבות שבות ישראל, שיח ומעלה אליהו ושירת בצנחנים. נמנה עם תלמידיו של הרב שג\"ר. מלמד ולומד גמרא בדרך ייחודית, עוסק בתורות חסידיות ובכתבי הרב זצ\"ל. רב מחנך בישיבת ההסדר 'אורות שאול' בת\"א. ד\"ר למשפטים",
        image: {
          src: "https://lh3.googleusercontent.com/d/1mDdkBR-bAeyR1h3c7wUfOE7O7QikzcPS",
          alt: "הרב מומי פאלוך",
        },
      },
      {
        id: "hana",
        name: "הרבנית חנה פרידמן (ד״ר)",
        phone: "050-7248778",
        program: "שיעורי משב רוח",
        bio: "מרצה עם ניסיון עשיר בהוראה ובהנחיית תלמידים.",
        hidden: true,
        image: {
          src: "https://lh3.googleusercontent.com/d/1s8bpuLL94O8fN15XhM4GueRxbrnFe793",
          alt: "הרבנית חנה פרידמן",
        },
      },
      {
        id: "lior",
        name: "ליאור טל שדה",
        phone: "054-7710753",
        program: "שיעורי משב רוח",
        bio: "מנוסה בתחום ההיסטוריה והתרבות, עם גישה חינוכית ייחודית.",
        hidden: true,
        image: {
          src: "https://lh3.googleusercontent.com/d/1w7azYsqdrlyxzVUqe2yiNuJaptGusrO_",
          alt: "ליאור טל שדה",
        },
      },
      {
        id: "shlomit",
        name: "הרבנית שלומית פלינט",
        phone: "052-8201903",
        program: "שיעורי ספרא",
        bio: "בוגרת המכון התלמודי עיוני במת\"ן ירושלים ועמיתה בתכנית לימודי הלכה 'וסמכת' של מדרשת עין הנצי\"ב וישיבת מעלה גלבוע. מלמדת גמרא והלכה במדרשת אמי\"ת באר בירוחם ובאשדוד. מוסמכת לרבנות",
        image: {
          src: "https://lh3.googleusercontent.com/d/1iAbWG1Ln5si7Y7ZsyOZk-Fvgeqhp49K8",
          alt: "הרבנית שלומית פלינט",
        },
      },
    ],
    hoursTitle: "זמני פעילות",
    hours: ["יום א' : 19:00 - שיעורי ספרא", "יום ד' : 19:00 - שיעורי ספרא"],
    directionsTitle: "דרכי הגעה",
    directionsText: "בית אמונה, דרך השלום 11, תל אביב",
    navButtons: [
      {
        id: "waze",
        label: "ווייז",
        href: "https://waze.com/ul?ll=32.072225,34.794921&navigate=yes",
        kind: "waze",
      },
      {
        id: "moovit",
        label: "מוביט",
        href: "https://moovitapp.com/israel-1/poi/%D7%93%D7%A8%D7%9A_%D7%94%D7%A9%D7%9C%D7%95%D7%9D_11-1?tll=32.072225_34.794921&fll=32.072225_34.794921",
        kind: "moovit",
      },
    ],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.105937996386!2d34.79273232467693!3d32.06668962002822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b9c03d4a0d1%3A0x620963936670410!2sDerech%20HaShalom%2011%2C%20Tel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1700000000000!5m2!1sen!2sil",
  },
};

