# מאגר הלומדות — Lomdot Hub

אתר תצוגה והזמנה של לומדות/מצגות לבתי ספר יסודיים ועל-יסודיים, בנוי ב-React + Vite + TypeScript,
עם שליפת נתונים דינמית מ-Google Sheets דרך Google Sheets API (ללא Backend, ללא Database, ללא Apps Script).

## הרצה מקומית

```bash
npm install
npm run dev
```

האתר יעלה בכתובת שתוצג בטרמינל (בדרך כלל `http://localhost:5173`).

## מבנה הפרויקט

```
src/
  components/       רכיבי UI (Header, Tabs, רשימת לומדות, Accordion, טופס הזמנה...)
  services/         googleSheetsService.ts - כל הלוגיקה של שליפת הנתונים מ-Google Sheets
  hooks/            useLearningMaterials.ts - hook לטעינת הנתונים עם מצבי טעינה/שגיאה
  types/            טיפוסי TypeScript (LearningMaterial, Creator וכו')
  styles/           משתני CSS (צבעים, טיפוגרפיה) וסגנון גלובלי
  config.ts         *** קובץ ההגדרות המרכזי - כאן מכניסים את הפרטים האמיתיים ***
```

## איך להזין את הפרטים האמיתיים

יש שתי דרכים - בחרו אחת מהן:

### דרך מומלצת: קובץ `.env.local`

1. העתיקו את הקובץ `.env.example` לקובץ חדש בשם `.env.local` (באותה תיקייה, ליד `package.json`).
2. מלאו את הערכים:

```env
VITE_GOOGLE_SHEETS_API_KEY=המפתח_שלכם
VITE_GOOGLE_SPREADSHEET_ID=המזהה_של_הגיליון
VITE_SHEET_NAME_ELEMENTARY=יסודי
VITE_SHEET_NAME_HIGHSCHOOL=תיכון
VITE_ORDER_RECIPIENT_EMAIL=the-real-email@example.co.il
```

3. הפעילו מחדש את `npm run dev`.

הקובץ `.env.local` לא נשלח ל-git (מוגדר ב-`.gitignore`), כך שהפרטים הרגישים נשארים אצלכם בלבד.

### דרך חלופית: עריכה ישירה של `src/config.ts`

אם אתם לא רוצים להשתמש בקובץ `.env`, ניתן להחליף ישירות את הערכים בתוך `src/config.ts`:

```ts
GOOGLE_SHEETS_API_KEY: '...',      // <-- כאן
SPREADSHEET_ID: '...',             // <-- וכאן
ORDER_RECIPIENT_EMAIL: '...',      // <-- וכאן
```

## איפה להשיג את ה-API Key וה-Spreadsheet ID

1. **Spreadsheet ID**: זהו החלק שבין `/d/` ל-`/edit` בכתובת ה-URL של הגיליון, לדוגמה:
   `https://docs.google.com/spreadsheets/d/`**`1AbCdEfGhIjKlMnOpQrStUvWxYz`**`/edit`

2. **API Key**:
   - היכנסו ל-[Google Cloud Console](https://console.cloud.google.com/)
   - צרו פרויקט (או בחרו פרויקט קיים)
   - הפעילו את ה-API בשם **Google Sheets API**
   - צרו Credentials מסוג **API Key**
   - **חשוב**: הגיליון עצמו חייב להיות משותף לפחות בהרשאת צפייה ("כל מי שיש לו את הקישור")
     כדי שהקריאה עם API Key (ללא התחברות משתמש) תעבוד.

3. **כתובת המייל לקבלת הזמנות**: זו הכתובת שאליה ייפתח טופס מייל מוכן מראש בלחיצה על
   "שליחת בקשת הזמנה" בתחתית האתר. ניתן לשנות אותה כאמור דרך `.env.local` או `src/config.ts`.

## מבנה העמודות בגיליון (כל שורה = לומדה אחת)

| עמודה A     | עמודה B | עמודה C | עמודה D  | עמודה E  | עמודה F  | עמודה G  | עמודה H  | עמודה I  | עמודה J  |
|-------------|---------|---------|----------|----------|----------|----------|----------|----------|----------|
| שם הלומדה   | מקצוע   | נושא    | קהל יעד  | יוצרת 1  | טלפון 1  | יוצרת 2  | טלפון 2  | יוצרת 3  | טלפון 3  |

- שורה 1 מיועדת לכותרות (לא נקראת).
- אם ללומדה יש פחות משלוש יוצרות, פשוט השאירו את התאים הרלוונטיים ריקים - הם יתעלמו אוטומטית.
- יש להשתמש באותם שמות בדיוק לגיליונות (טאבים) בתוך קובץ ה-Sheet: **יסודי** ו-**תיכון**
  (או להגדיר שמות אחרים דרך `VITE_SHEET_NAME_ELEMENTARY` / `VITE_SHEET_NAME_HIGHSCHOOL`).

## הוספת לוגו

בקובץ `src/components/Header.tsx` יש מקום מסומן וברור (`logo-placeholder`) - יש להחליף אותו
בתגית `<img src="/logo.png" alt="..." />` לאחר הנחת קובץ הלוגו בתיקיית `public/`.

## טופס ההזמנה - איך זה עובד היום

הטופס בתחתית האתר אוסף: שם המנהלת/מנהל, מייל מוסד, שם מוסד, ועד 4 לומדות נבחרות
(הבחירה עצמה מתבצעת דרך ה-Checkbox "לבחירה בהזמנה" שמופיע ליד כל לומדה, גם בטאב יסודי וגם בתיכון).

בלחיצה על "שליחת בקשת הזמנה" נפתח לקוח המייל של המשתמש עם מייל מוכן-מראש (Subject + Body) אל
כתובת `ORDER_RECIPIENT_EMAIL`. זהו פתרון פשוט וחינמי לחלוטין שאינו דורש Backend.

בהמשך, ניתן להחליף את פונקציית השליחה (`handleSubmit` בקובץ `src/components/OrderForm.tsx`)
בשירות שליחה אחר (כגון Formspree, EmailJS, או Google Form) מבלי לשנות דבר בשאר האתר.

## טכנולוגיות

- React 18 + TypeScript
- Vite
- ללא Redux, ללא Backend עצמאי, ללא Database, ללא Google Apps Script
- שליפת נתונים ישירה מהדפדפן מול Google Sheets API v4 (REST, עם API Key)
