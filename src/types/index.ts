/** שכבת יעד: יסודי או תיכון */
export type EducationLevel = 'elementary' | 'highSchool';

/** יוצרת לומדה - שם וטלפון */
export interface Creator {
  name: string;
  phone: string;
}

/** לומדה/מצגת בודדת כפי שהיא נשלפת ומעובדת מה-Google Sheet */
export interface LearningMaterial {
  /** מזהה ייחודי פנימי (נבנה מ-level + אינדקס השורה) */
  id: string;
  level: EducationLevel;
  name: string;
  subject: string;
  topic: string;
  targetAudience: string;
  creators: Creator[];
}

/** מבנה השגיאה שמוחזר בעת כשל בשליפת הנתונים */
export interface FetchError {
  message: string;
}

/** נתוני טופס ההזמנה */
export interface OrderFormData {
  managerName: string;
  institutionEmail: string;
  institutionName: string;
  selectedMaterialIds: string[];
}
