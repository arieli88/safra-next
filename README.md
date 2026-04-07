# בית מדרש ספרא - Next.js

פרויקט Next.js מודרני עבור אתר "בית מדרש ספרא", עם App Router, TypeScript, Tailwind CSS, קרוסלות, ticker דינמי, דף יצירת קשר, וכלי ניהול לעריכת תוכן בזמן אמת.

## מה יש בפרויקט

- דף בית חדש ומודרני עם כל התוכן מהאתר הקיים
- דף `contact` עם מרצים, זמני פעילות ודרכי הגעה
- `Admin UI` מוגן בסיסמה תחת `/admin`
- שמירת תוכן דינמי ב-`Vercel KV`
- API routes לעריכה ושליפה של התוכן
- תמיכה בהמרה אוטומטית של קישורי Google Drive לתמונות ישירות
- כפתור נגישות פעיל
- קרוסלות מרובות עם `embla-carousel-react`

## משתני סביבה

העתיקו את [`.env.example`](/c:/Users/USER/Projects/safra_next/safra-next/.env.example) ל-`.env.local` והגדירו:

- `ADMIN_PASSWORD`: סיסמת הכניסה ל-Admin UI
- `KV_REST_API_URL`: כתובת ה-KV של Vercel
- `KV_REST_API_TOKEN`: טוקן גישה ל-KV
- `KV_REST_API_READ_ONLY_TOKEN`: אופציונלי

אם `KV` לא מוגדר, האפליקציה תשתמש בברירת מחדל בזיכרון בזמן פיתוח.

## פיתוח מקומי

```bash
npm install
npm run dev
```

אתר: `http://localhost:3000`

ממשק ניהול: `http://localhost:3000/admin`

## בדיקות

```bash
npm run lint
npm run build
```

## פריסה ל-Vercel

1. העלו את הפרויקט ל-Git.
2. חברו את הריפו ל-Vercel.
3. הגדירו את משתני הסביבה.
4. הוסיפו אינטגרציית KV/Redis דרך Vercel.
5. פרסו.

## הערות

- ברירת המחדל של התוכן נמצאת ב-[`lib/default-site-content.ts`](/c:/Users/USER/Projects/safra_next/safra-next/lib/default-site-content.ts).
- שכבת האחסון נמצאת ב-[`lib/site-content-store.ts`](/c:/Users/USER/Projects/safra_next/safra-next/lib/site-content-store.ts).
- מסך הניהול משתמש גם בעורך JSON מלא למקרה שתרצו לערוך שדות נוספים מעבר לשדות המודרכים.
