import { useState, type FormEvent } from 'react';
import './OrderForm.css';
import { CONFIG } from '../config';
import type { LearningMaterial } from '../types';

interface OrderFormProps {
  selectedMaterials: LearningMaterial[];
  onRemoveMaterial: (id: string) => void;
}

interface FormState {
  managerName: string;
  institutionEmail: string;
  institutionName: string;
}

const INITIAL_STATE: FormState = {
  managerName: '',
  institutionEmail: '',
  institutionName: '',
};

const buildMailtoLink = (form: FormState, materials: LearningMaterial[]): string => {
  const subject = `בקשת הזמנת לומדות - ${form.institutionName || 'מוסד חינוכי'}`;

  const materialsList = materials
    .map((m, i) => `${i + 1}. ${m.name} (${m.subject || 'ללא מקצוע'})`)
    .join('\n');

  const body = [
    `שם המנהלת/המנהל: ${form.managerName}`,
    `מייל המוסד: ${form.institutionEmail}`,
    `שם המוסד: ${form.institutionName}`,
    '',
    'לומדות שנבחרו:',
    materialsList || '(לא נבחרו לומדות)',
  ].join('\n');

  return `mailto:${CONFIG.ORDER_RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};

const OrderForm = ({ selectedMaterials, onRemoveMaterial }: OrderFormProps) => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  const selectedCount = selectedMaterials.length;
  const maxCount = CONFIG.MAX_SELECTED_MATERIALS;

  const updateField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isFormValid =
    form.managerName.trim() !== '' &&
    form.institutionEmail.trim() !== '' &&
    form.institutionName.trim() !== '' &&
    selectedCount > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // === נקודת שילוח ההזמנה ===
    // הפתרון הפשוט/החינמי המובנה כאן: פתיחת לקוח המייל של המשתמש עם טופס מוכן.
    // כתובת היעד מוגדרת ב-CONFIG.ORDER_RECIPIENT_EMAIL (src/config.ts).
    // אפשר בעתיד להחליף בקריאה לשירות כמו Formspree / EmailJS / Google Form
    // מבלי לשנות דבר בממשק - רק את הפונקציה הזו.
    const mailtoLink = buildMailtoLink(form, selectedMaterials);
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <section className="order-form" id="order-form">
      <div className="container">
        <div className="order-form__intro">
          <h2>טופס הזמנת לומדות</h2>
          <p>בחרו עד {maxCount} לומדות מהרשימות למעלה ומלאו את הפרטים הבאים</p>
        </div>

        <form className="order-form__card" onSubmit={handleSubmit}>
          <div className="order-form__grid">
            <label className="order-form__field">
              <span>שם המנהלת / המנהל</span>
              <input
                type="text"
                required
                value={form.managerName}
                onChange={updateField('managerName')}
                placeholder="לדוגמה: דנה כהן"
              />
            </label>

            <label className="order-form__field">
              <span>מייל מוסד</span>
              <input
                type="email"
                required
                value={form.institutionEmail}
                onChange={updateField('institutionEmail')}
                placeholder="office@school.edu.il"
              />
            </label>

            <label className="order-form__field order-form__field--full">
              <span>שם המוסד</span>
              <input
                type="text"
                required
                value={form.institutionName}
                onChange={updateField('institutionName')}
                placeholder="לדוגמה: בית ספר יסודי הדקל"
              />
            </label>
          </div>

          <div className="order-form__selection">
            <div className="order-form__selection-header">
              <h3>לומדות שנבחרו</h3>
              <span
                className={`order-form__counter ${
                  selectedCount >= maxCount ? 'is-full' : ''
                }`}
              >
                {selectedCount} / {maxCount}
              </span>
            </div>

            {selectedCount === 0 ? (
              <p className="order-form__empty">
                טרם נבחרו לומדות. סמנו "לבחירה בהזמנה" ליד הלומדות הרצויות בטאבים למעלה.
              </p>
            ) : (
              <ul className="order-form__chips">
                {selectedMaterials.map((material) => (
                  <li key={material.id} className="order-form__chip">
                    <span>{material.name}</span>
                    <button
                      type="button"
                      aria-label={`הסירו את ${material.name} מהבחירה`}
                      onClick={() => onRemoveMaterial(material.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="order-form__footer">
            <button type="submit" className="order-form__submit" disabled={!isFormValid}>
              שליחת בקשת הזמנה
            </button>
            {submitted && (
              <p className="order-form__success">
                לקוח המייל נפתח עם פרטי הבקשה. אם לא נפתח אוטומטית, ניתן לשלוח ידנית אל{' '}
                <strong>{CONFIG.ORDER_RECIPIENT_EMAIL}</strong>.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default OrderForm;
