import { useState, type ChangeEvent, type FormEvent } from 'react';
import './OrderForm.css';
import type { LearningMaterial } from '../types';
import { CONFIG } from '../config';

interface OrderFormProps {
  materials: LearningMaterial[];
  selectedMaterials: LearningMaterial[];
  onToggleMaterial: (id: string) => void;
}

interface FormState {
  managerName: string;
  institutionEmail: string;
  institutionName: string;
}

const initialForm: FormState = {
  managerName: '',
  institutionEmail: '',
  institutionName: '',
};

const buildMailtoLink = (
  form: FormState,
  materials: LearningMaterial[]
) => {
  const subject = `הזמנת לומדות - ${form.institutionName}`;

  const materialsList = materials
    .map((material) => `- ${material.name}`)
    .join('\n');

  const body = `שלום,

ברצוני להזמין את הלומדות הבאות:

${materialsList}

פרטי המזמין:
שם מנהל/ת: ${form.managerName}
שם מוסד: ${form.institutionName}
אימייל: ${form.institutionEmail}

תודה!`;

  return `mailto:${CONFIG.ORDER_RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
};

const OrderForm = ({
  materials,
  selectedMaterials,
  onToggleMaterial,
}: OrderFormProps) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const selectedCount = selectedMaterials.length;
  const maxCount = CONFIG.MAX_SELECTED_MATERIALS;

  const availableMaterials = materials.filter(
    (material) =>
      !selectedMaterials.some(
        (selectedMaterial) => selectedMaterial.id === material.id
      )
  );

  const isFormValid =
    form.managerName.trim() !== '' &&
    form.institutionEmail.trim() !== '' &&
    form.institutionName.trim() !== '' &&
    selectedCount > 0;

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAdditionalMaterialChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const materialId = event.target.value;

    if (materialId) {
      onToggleMaterial(materialId);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const mailtoLink = buildMailtoLink(
      form,
      selectedMaterials
    );

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <section className="order-form">
      <div className="container">

        {/* כותרת */}
        <div className="order-form__intro">
          <h2>הזמנת לומדות</h2>

          <p>
            מלאו את הפרטים ובחרו את הלומדות שתרצו להזמין
          </p>
        </div>

        {/* הכרטיס המרכזי */}
        <div className="order-form__card">

          <form onSubmit={handleSubmit}>

            {/* פרטי המזמין */}
            <div className="order-form__grid">

              <div className="order-form__field">
                <span>שם מנהל/ת</span>

                <input
                  type="text"
                  value={form.managerName}
                  onChange={updateField('managerName')}
                  placeholder="הקלד/י שם"
                  required
                />
              </div>

              <div className="order-form__field">
                <span>שם המוסד</span>

                <input
                  type="text"
                  value={form.institutionName}
                  onChange={updateField('institutionName')}
                  placeholder="הקלד/י שם מוסד"
                  required
                />
              </div>

              <div className="order-form__field order-form__field--full">
                <span>כתובת אימייל</span>

                <input
                  type="email"
                  value={form.institutionEmail}
                  onChange={updateField('institutionEmail')}
                  placeholder="example@email.com"
                  required
                />
              </div>

            </div>

            {/* בחירת לומדות */}
            <div className="order-form__selection">

              <div className="order-form__selection-header">

                <h3>בחירת לומדות</h3>

                <span
                  className={`order-form__counter ${
                    selectedCount >= maxCount ? 'is-full' : ''
                  }`}
                >
                  {selectedCount} / {maxCount}
                </span>

              </div>

              {/* הלומדות שכבר נבחרו */}
              {selectedMaterials.length === 0 ? (
                <p className="order-form__empty">
                  עדיין לא נבחרו לומדות
                </p>
              ) : (
                <ul className="order-form__chips">
                  {selectedMaterials.map((material) => (
                    <li
                      className="order-form__chip"
                      key={material.id}
                    >
                      <span>{material.name}</span>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleMaterial(material.id)
                        }
                        aria-label={`הסר את ${material.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* בחירת לומדה נוספת */}
              <div
                className="order-form__field"
                style={{ marginTop: '18px' }}
              >
                <span>בחר לומדה נוספת</span>

                <select
                  value=""
                  onChange={handleAdditionalMaterialChange}
                  disabled={
                    selectedCount >= maxCount ||
                    availableMaterials.length === 0
                  }
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '14.5px',
                    color: 'var(--color-text)',
                    background: 'var(--color-bg)',
                    width: '100%',
                  }}
                >
                  <option value="">
                    {selectedCount >= maxCount
                      ? 'הגעת למספר הלומדות המרבי'
                      : availableMaterials.length === 0
                        ? 'כל הלומדות נבחרו'
                        : '-- בחר לומדה --'}
                  </option>

                  {availableMaterials.map((material) => (
                    <option
                      key={material.id}
                      value={material.id}
                    >
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* כפתור שליחה */}
            <div className="order-form__footer">

              <button
                type="submit"
                className="order-form__submit"
                disabled={!isFormValid}
              >
                שליחת הזמנה
              </button>

              {submitted && (
                <p className="order-form__success">
                  ההזמנה נפתחה לשליחה באפליקציית הדואר שלך.
                </p>
              )}

            </div>

          </form>

        </div>
      </div>
    </section>
  );
};

export default OrderForm;