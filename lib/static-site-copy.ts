import type { SiteContent } from "@/lib/types";

const STATIC_ADDRESS = "בית אמונה, דרך השלום 11, תל אביב";
const STATIC_RESOURCES_LINK = "https://drive.google.com/drive/folders/1VerAkXvv7LTz3SoGuzgo1dNwcm8GGoz2";

export function withStaticSiteCopy(content: SiteContent): SiteContent {
  const next = structuredClone(content);

  next.meta.address = STATIC_ADDRESS;
  next.meta.resourcesLink = STATIC_RESOURCES_LINK;

  next.nav.title = "בית מדרש ספרא";
  next.nav.subtitle = "לימוד, קהילה וחיבור בתל אביב";

  next.hero.eyebrow = "ספרא";
  next.hero.title = "ספרא - זה הזמן לעצור רגע. ללמוד. להתחבר.";
  next.hero.body =
    "בית מדרש ספרא - רגע של נשמה באמצע השירות.\nמקום של לימוד, שיח וחיבור לחיילים ולחיילות בלב תל אביב.";
  next.hero.ctaLabel = "גלה עוד על ספרא";
  next.hero.ctaHref = "#about";
  next.hero.ctaHidden = false;
  next.hero.infoEyebrow = "רגע של נשמה באמצע השירות";
  next.hero.infoCards = [
    {
      id: "resources",
      eyebrow: "חומרי האתר",
      title: "גישה מהירה לקבצים ולחומרים",
      href: STATIC_RESOURCES_LINK,
      hidden: false,
    },
    {
      id: "contact",
      eyebrow: "צור קשר",
      title: "מרצים, זמנים ודרכי הגעה",
      href: "/contact",
      hidden: false,
    },
  ];

  next.about.eyebrow = "בית מדרש ספרא";
  next.about.title = "מה זה בית מדרש ספרא?";
  next.about.body =
    'בית מדרש "ספרא" הוא מקום פתוח לחיילות ולחיילים, דתיים, חילונים וכל מי שנמצא באמצע, שמחפשים רגע של משמעות, חיבור וקהילה. המפגשים מתקיימים בלב תל אביב וכוללים לימוד, ארוחת ערב טובה ושיח בגובה העיניים. בואו לטעום משהו אחר, אנושי ואמיתי.';
  next.about.cardEyebrow = "רוח המקום";
  next.about.cardTitle = "לימוד, שיחה וקהילה במקום אחד";
  next.about.cardBody =
    "בית המדרש פועל כמקום מזמין ואמיתי, עם שיח פתוח, תוכן משמעותי ואווירה שמרגישה כמו בית לחיבור, למפגש וללימוד.";
  next.about.addressLabel = "כתובת";
  next.about.addressText = STATIC_ADDRESS;

  next.community.eyebrow = "בית מדרש ספרא";
  next.community.title = "הצטרפו לקהילה שלנו";
  next.community.footnote =
    "הצטרפו לקבוצת WhatsApp שלנו וקבלו עדכונים על שיעורים, אירועים ופעילויות.";
  next.community.lecturersCtaLabel = "פגשו את המרצים שלנו";
  next.community.lecturersCtaHref = "/contact";
  if (next.community.tracks[0]) {
    next.community.tracks[0].title = "שיעורי ספרא";
    next.community.tracks[0].subtitle = "לימוד תורני עמוק";
    next.community.tracks[0].schedule = "יום א' ויום ד' | 19:00";
    next.community.tracks[0].description =
      "לימוד מעמיק בתורה, הלכה ומחשבה יהודית. מתאים לכל הרמות.";
    next.community.tracks[0].whatsappLabel = "הצטרפו לקבוצת WhatsApp - ספרא";
  }

  next.history.eyebrow = "בית מדרש ספרא";
  next.history.title = "היסטוריית המקום";
  next.history.body =
"בית המדרש הוקם באלול תשפ\"ג מתוך רצון לתת מענה לימודי, רוחני וחברתי לחיילים ולחיילות המשרתים בגוש דן.\nלצד סדרי לימוד אישיים וקבועים מתקיימים בו שיעורים, הרצאות וסדנאות מגוונות, ובמהלך המפגשים מוגשת ארוחת ערב ומתקיימת דינמיקה חברתית פתוחה ומגבשת.";
  if (next.history.media[2]) {
    next.history.media[2].linkLabel = "כתבה - מקור ראשון";
    next.history.media[2].linkHref = "https://www.makorrishon.co.il/culture/764299/";
  }

  next.gallery.eyebrow = "בית מדרש ספרא";
  next.gallery.title = "תמונות נוספות";
  next.gallery.description = "רגעים מתוך הלימוד, המפגשים והקהילה של בית מדרש ספרא.";
  if (next.gallery.carousels[0]) {
    next.gallery.carousels[0].title = "גלריית ספרא";
    next.gallery.carousels[0].description =
      "מבחר תמונות מהשיעורים, הערבים המשותפים והמפגשים.";
  }

  next.footer.title = "בית מדרש ספרא";
  next.footer.address = STATIC_ADDRESS;
  next.footer.copyright = "© 2026 בית מדרש ספרא. כל הזכויות שמורות.";

  next.contactPage.eyebrow = "בית מדרש ספרא";
  next.contactPage.title = "פרטי יצירת קשר עם המרצים";
  next.contactPage.description =
    "כאן תוכלו ליצור קשר עם צוות בית המדרש, לקבל מענה מהיר, לראות שעות פעילות ולקבל דרכי הגעה בלחיצה אחת.";
  next.contactPage.backLabel = "חזרה לעמוד הבית";
  next.contactPage.hoursTitle = "זמני פעילות";
  next.contactPage.directionsTitle = "דרכי הגעה";
  next.contactPage.directionsText = STATIC_ADDRESS;

  return next;
}

