import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { createPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content-store";
import { withStaticSiteCopy } from "@/lib/static-site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const content = withStaticSiteCopy(await getSiteContent());

  return createPageMetadata({
    title: "הצהרת נגישות",
    description:
      "הצהרת הנגישות של אתר בית מדרש ספרא, כולל פירוט התאמות נגישות, שימוש במקלדת ודרכי יצירת קשר בנושא.",
    path: "/accessibility",
    keywords: [...content.meta.keywords, "נגישות", "הצהרת נגישות"],
  });
}

export default async function AccessibilityPage() {
  const content = withStaticSiteCopy(await getSiteContent());
  const visibleLecturers = content.contactPage.lecturers.filter((lecturer) => !lecturer.hidden);

  return (
    <div className="min-h-screen">
      <Header nav={content.nav} logoUrl={content.meta.logoUrl} />

      <main className="site-section pb-10 pt-6">
        <div className="site-shell-narrow grid gap-5">
          <section className="rounded-[1.7rem] border border-brand/10 bg-white/85 p-5 shadow-[0_20px_55px_rgba(66,40,28,0.08)] sm:p-8">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-brand">הצהרת נגישות</p>
            <h1 className="mt-3 font-serif text-[2rem] font-bold text-foreground sm:text-[3rem]">נגישות אתר בית מדרש ספרא</h1>
            <p className="mt-5 text-base leading-8 text-muted">
              אנו פועלים להנגשת האתר בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות, לתקן הישראלי ת&quot;י 5568, ועל בסיס עקרונות
              WCAG 2.1 ברמה AA. האתר נבנה כך שיאפשר שימוש נוח בעכבר, במקלדת, בקוראי מסך, בהגדלת תצוגה ובהפחתת תנועה.
            </p>
            <p className="mt-3 text-sm text-muted">תאריך עדכון אחרון: 25 במרץ 2026</p>
          </section>

          <section className="rounded-[1.7rem] border border-brand/10 bg-white/85 p-5 shadow-[0_20px_55px_rgba(66,40,28,0.08)] sm:p-8">
            <h2 className="font-serif text-[1.65rem] font-bold text-foreground sm:text-[2.15rem]">מה קיים באתר</h2>
            <div className="mt-4 grid gap-3 text-[0.95rem] leading-8 text-muted">
              <p>האתר תומך בשפה עברית, בכיוון כתיבה מימין לשמאל, בדילוג ישיר לתוכן הראשי ובסדר קריאה תקין.</p>
              <p>תפריט המובייל וכלי הנגישות כוללים ניהול פוקוס, סגירה במקש Escape ותפעול מלא במקלדת.</p>
              <p>בטיקר העדכונים קיים כפתור ברור להפעלה ולהשהיה של התנועה.</p>
              <p>כלי הנגישות כולל הגדלת טקסט, ניגודיות, הפחתת תנועה, הדגשת פוקוס וקישורים, ריווח, התאמת רוויה, הקראת הדף ותרגום מסייע.</p>
            </div>
          </section>

          <section className="rounded-[1.7rem] border border-brand/10 bg-white/85 p-5 shadow-[0_20px_55px_rgba(66,40,28,0.08)] sm:p-8">
            <h2 className="font-serif text-[1.65rem] font-bold text-foreground sm:text-[2.15rem]">שימוש נגיש</h2>
            <div className="mt-4 grid gap-3 text-[0.95rem] leading-8 text-muted">
              <p>ניתן לנווט באתר באמצעות מקש Tab, לעבור בין קישורים וכפתורים, ולהפעיל רכיבים באמצעות Enter או רווח.</p>
              <p>ניתן לעצור תנועה אוטומטית בטיקר ולהפעיל הקראה של תוכן הדף מתוך כלי הנגישות.</p>
              <p>התרגום לשפות נוספות מתבצע זמנית בתוך הדף באמצעות תוסף הנגישות, ונועד לסיוע בלבד.</p>
            </div>
          </section>

          <section className="rounded-[1.7rem] border border-brand/10 bg-white/85 p-5 shadow-[0_20px_55px_rgba(66,40,28,0.08)] sm:p-8">
            <h2 className="font-serif text-[1.65rem] font-bold text-foreground sm:text-[2.15rem]">יצירת קשר בנושא נגישות</h2>
            <div className="mt-4 grid gap-3 text-[0.95rem] leading-8 text-muted">
              <p>
                לפניות בנושא נגישות דיגיטלית, בקשות סיוע או דיווח על תקלה ניתן לפנות דרך דף{" "}
                <Link href="/contact" className="font-bold text-brand underline">
                  צור קשר
                </Link>
                .
              </p>
              {visibleLecturers.length > 0 ? (
                <p>
                  מוקדי קשר זמינים באתר: {visibleLecturers.map((lecturer) => `${lecturer.name} (${lecturer.phone})`).join(" | ")}
                </p>
              ) : null}
              <p>כתובת הפעילות: {content.meta.address}</p>
              <p>אם נתקלתם בקושי, נשמח לקבל פנייה ולבצע בדיקה, תיקון או מתן חלופה נגישה בהקדם האפשרי.</p>
            </div>
          </section>

          <section className="rounded-[1.7rem] border border-amber-200 bg-amber-50/90 p-5 shadow-[0_20px_55px_rgba(66,40,28,0.08)] sm:p-8">
            <h2 className="font-serif text-[1.65rem] font-bold text-foreground sm:text-[2.15rem]">הבהרה חשובה</h2>
            <div className="mt-4 grid gap-3 text-[0.95rem] leading-8 text-muted">
              <p>הקראה ותרגום מסייעים תלויים ביכולות הדפדפן, בשפת המכשיר ובתוסף עצמו, ולכן איכותם עשויה להשתנות בין מכשירים.</p>
              <p>כדי להשלים הצהרה ארגונית מלאה ללא פערים רגולטוריים, מומלץ לוודא מול הנהלת המקום גם פרטי אחראי נגישות והסדרי נגישות פיזיים מעודכנים.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer footer={content.footer} />
    </div>
  );
}
