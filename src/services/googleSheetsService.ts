import { CONFIG } from '../config';
import type { Creator, EducationLevel, LearningMaterial } from '../types';

/**
 * שירות לשליפת נתוני הלומדות מ-Google Sheets באמצעות Google Sheets API v4.
 *
 * הקריאה נעשית ישירות מהדפדפן (Client-Side) בעזרת API Key בלבד,
 * ללא צורך ב-Backend עצמאי, ללא Database וללא Google Apps Script.
 *
 * דרישה: הגיליון חייב להיות משותף לפחות בהרשאת "כל מי שיש לו את הקישור - צפייה"
 * (Anyone with the link - Viewer), אחרת בקשת ה-API תיכשל גם עם מפתח תקין.
 */

// סדר העמודות בכל גיליון:
// A: שם הלומדה | B: מקצוע | C: נושא | D: קהל יעד | E: תיאור
// F: יוצרת 1 | G: טלפון 1 | H: יוצרת 2 | I: טלפון 2 | J: יוצרת 3 | K: טלפון 3
const COLUMN_INDEX = {
  name: 0,
  subject: 1,
  topic: 2,
  targetAudience: 3,
  description: 4,
  creator1Name: 5,
  creator1Phone: 6,
  creator2Name: 7,
  creator2Phone: 8,
  creator3Name: 9,
  creator3Phone: 10,
} as const;

type SheetRow = string[];

/**
 * מנתח טקסט CSV בהתאם ל-RFC 4180: תומך בשדות עטופים במרכאות,
 * מרכאות כפולות מוברחות (""), ופסיקים או ירידות שורה בתוך שדה עטוף.
 * זה הכרחי כי עמודת "תיאור" עשויה להכיל פסיקים וירידות שורה.
 */
const parseCsv = (text: string): SheetRow[] => {
  const rows: SheetRow[] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  const normalized = text.replace(/\r\n?/g, '\n');

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const buildSheetsUrl = (level: EducationLevel): string => {
  return level === 'elementary'
    ? CONFIG.SHEET_URL_ELEMENTARY
    : CONFIG.SHEET_URL_HIGHSCHOOL;
};

/** בונה רשימת יוצרות מתוך שורה גולמית, תוך התעלמות מיוצרות ריקות */
const extractCreators = (row: SheetRow): Creator[] => {
  const pairs: Array<[string | undefined, string | undefined]> = [
    [row[COLUMN_INDEX.creator1Name], row[COLUMN_INDEX.creator1Phone]],
    [row[COLUMN_INDEX.creator2Name], row[COLUMN_INDEX.creator2Phone]],
    [row[COLUMN_INDEX.creator3Name], row[COLUMN_INDEX.creator3Phone]],
  ];

  return pairs
    .filter(([name]) => Boolean(name && name.trim()))
    .map(([name, phone]) => ({
      name: (name ?? '').trim(),
      phone: (phone ?? '').trim(),
    }));
};

const rowToLearningMaterial = (
  row: SheetRow,
  index: number,
  level: EducationLevel
): LearningMaterial | null => {
  const name = row[COLUMN_INDEX.name]?.trim();
  // דילוג על שורות ריקות (למשל שורה אחרונה ריקה בגיליון)
  if (!name) return null;

  return {
    id: `${level}-${index}`,
    level,
    name,
    subject: row[COLUMN_INDEX.subject]?.trim() ?? '',
    topic: row[COLUMN_INDEX.topic]?.trim() ?? '',
    targetAudience: row[COLUMN_INDEX.targetAudience]?.trim() ?? '',
    description: row[COLUMN_INDEX.description]?.trim() ?? '',
    creators: extractCreators(row),
  };
};

/** שולף את כל הלומדות מגיליון בודד (יסודי או תיכון) */
export const fetchLearningMaterials = async (
  level: EducationLevel
): Promise<LearningMaterial[]> => {
  const response = await fetch(buildSheetsUrl(level));
  console.log('URL:', buildSheetsUrl(level));
  console.log('Response URL:', response.url);
  console.log('Content-Type:', response.headers.get('content-type'));
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
'אין הרשאה לגשת לגיליון. ודאו שהגיליון פורסם באמצעות Publish to web.' );
    }
    if (response.status === 400) {
      throw new Error(
`בקשה לא תקינה בשליפת הנתונים מהגיליון. ודאו שכתובת הגיליון תקינה.`);
    }
    throw new Error(`שגיאה בשליפת הנתונים מ-Google Sheets (קוד ${response.status}).`);
  }

  const csv = await response.text();

  const rows = parseCsv(csv).slice(1); // דילוג על שורת הכותרות

  return rows
    .map((row, index) => rowToLearningMaterial(row, index, level))
    .filter((item): item is LearningMaterial => item !== null);
};

/** שולף במקביל גם את היסודי וגם את התיכון */
export const fetchAllLearningMaterials = async (): Promise<{
  elementary: LearningMaterial[];
  highSchool: LearningMaterial[];
}> => {
  const [elementary, highSchool] = await Promise.all([
    fetchLearningMaterials('elementary'),
    fetchLearningMaterials('highSchool'),
  ]);

  return { elementary, highSchool };
};
