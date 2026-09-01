/**
 * ==============================================
 *  קובץ ההגדרות המרכזי של הפרויקט
 * ==============================================
 * כאן, ורק כאן, יש להכניס את הפרטים האמיתיים שלכם.
 *
 * מומלץ: אל תערכו את הערכים ישירות בקובץ הזה בפרויקט אמיתי -
 * במקום זאת, צרו קובץ בשם .env.local (העתק של .env.example)
 * ומלאו שם את הערכים. הקובץ הזה יקרא אותם אוטומטית.
 *
 * אם אין .env.local, יופיעו כאן ערכי ברירת המחדל (Placeholders)
 * בלבד לצורך פיתוח - האתר לא יצליח למשוך נתונים אמיתיים עד
 * שיוזנו ערכים אמיתיים.
 * ==============================================
 */

// export const CONFIG = {
//   /**
//    * מפתח Google Sheets API (API Key).
//    * איך משיגים: Google Cloud Console -> APIs & Services -> Credentials
//    * צריך גם להפעיל את ה-API בשם "Google Sheets API" בפרויקט ה-Google Cloud.
//    * <<< הכניסו כאן את ה-Token/API Key שלכם, או הגדירו VITE_GOOGLE_SHEETS_API_KEY ב-.env.local >>>
//    */
//   GOOGLE_SHEETS_API_KEY:
//     import.meta.env.VITE_GOOGLE_SHEETS_API_KEY ?? 'YOUR_GOOGLE_API_KEY_HERE',

//   /**
//    * מזהה הגיליון (Spreadsheet ID).
//    * ניתן למצוא בכתובת ה-URL של הגיליון:
//    * https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
//    * <<< הכניסו כאן את ה-Spreadsheet ID, או הגדירו VITE_GOOGLE_SPREADSHEET_ID ב-.env.local >>>
//    */
//   SPREADSHEET_ID:
//     import.meta.env.VITE_GOOGLE_SPREADSHEET_ID ?? 'YOUR_SPREADSHEET_ID_HERE',

//   /**
//    * שמות הגיליונות (Tabs) בקובץ ה-Google Sheet, בדיוק כפי שהם מופיעים שם.
//    */
//   SHEET_NAMES: {
//     elementary:
//       import.meta.env.VITE_SHEET_NAME_ELEMENTARY ?? 'יסודי',
//     highSchool:
//       import.meta.env.VITE_SHEET_NAME_HIGHSCHOOL ?? 'תיכון',
//   },

//   /**
//    * הטווח בתוך כל גיליון שממנו יישלפו הנתונים.
//    * A:J מכסה 10 עמודות: שם הלומדה, מקצוע, נושא, קהל יעד,
//    * יוצרת 1, טלפון 1, יוצרת 2, טלפון 2, יוצרת 3, טלפון 3.
//    * שורה 1 מניחה שהיא שורת כותרות ולכן הקריאה מתחילה משורה 2.
//    */
//   SHEET_RANGE: 'A2:J1000',

//   /**
//    * כתובת המייל שאליה יישלחו טפסי ההזמנה.
//    * <<< הכניסו כאן את כתובת המייל האמיתית, או הגדירו VITE_ORDER_RECIPIENT_EMAIL ב-.env.local >>>
//    */
//   ORDER_RECIPIENT_EMAIL:
//     import.meta.env.VITE_ORDER_RECIPIENT_EMAIL ?? 'orders@example.co.il',

//   /** מספר הלומדות המקסימלי שניתן לבחור בטופס ההזמנה */
//   MAX_SELECTED_MATERIALS: 4,
// } as const;

// /** בדיקה נוחה האם ההגדרות עדיין על ברירת המחדל (טרם הוזנו נתונים אמיתיים) */
// export const isUsingPlaceholderConfig = (): boolean => {
//   return (
//     CONFIG.GOOGLE_SHEETS_API_KEY === 'YOUR_GOOGLE_API_KEY_HERE' ||
//     CONFIG.SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE'
//   );
// };

export const CONFIG = {
  SHEET_URL_ELEMENTARY: import.meta.env.VITE_SHEET_URL_ELEMENTARY,
  SHEET_URL_HIGHSCHOOL: import.meta.env.VITE_SHEET_URL_HIGHSCHOOL,
  MAX_SELECTED_MATERIALS: 4,
  ORDER_RECIPIENT_EMAIL:"sh0527132865@gmail.com"

};


export const isUsingPlaceholderConfig = (): boolean => {
  return false;
};