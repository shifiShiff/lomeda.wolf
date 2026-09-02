import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import './OrderForm.css';
import type { LearningMaterial } from '../types';
import { CONFIG } from '../config';
import emailjs from '@emailjs/browser';

interface OrderFormProps {
  materials: LearningMaterial[];
  selectedMaterials: LearningMaterial[];
  onToggleMaterial: (id: string) => void;
}

interface FormState {
  managerName: string;
  institutionName: string;
  institutionEmail: string;
  schoolAddress: string;
  contactName: string;
  contactPhone: string;
  dream: string;
}

const initialForm: FormState = {
  managerName: '',
  institutionName: '',
  institutionEmail: '',
  schoolAddress: '',
  contactName: '',
  contactPhone: '',
  dream: '',
};

const LEVEL_LABEL: Record<string, string> = {
  elementary: 'יסודי',
  highSchool: 'תיכון',
};

type LevelFilter = 'all' | 'elementary' | 'highSchool';

const FILTERS: LevelFilter[] = ['all', 'elementary', 'highSchool'];

const OrderForm = ({ materials, selectedMaterials, onToggleMaterial }: OrderFormProps) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [pickerOpen, setPickerOpen] = useState(false);

  const comboRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;

    const handlePointer = (event: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPickerOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    searchRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [pickerOpen]);

  const maxCount = CONFIG.MAX_SELECTED_MATERIALS;
  const selectedCount = selectedMaterials.length;
  const isFull = selectedCount >= maxCount;

  const selectedIds = useMemo(
    () => new Set(selectedMaterials.map((material) => material.id)),
    [selectedMaterials]
  );

  const filteredMaterials = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return materials.filter((material) => {
      if (levelFilter !== 'all' && material.level !== levelFilter) return false;
      if (!normalized) return true;
      return [material.name, material.subject, material.topic].some((field) =>
        field?.toLowerCase().includes(normalized)
      );
    });
  }, [materials, query, levelFilter]);

  const isFormValid =
    form.managerName.trim() !== '' &&
    form.institutionName.trim() !== '' &&
    form.institutionEmail.trim() !== '' &&
    form.schoolAddress.trim() !== '' &&
    form.contactName.trim() !== '' &&
    form.contactPhone.trim() !== '' &&
    selectedCount > 0;

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid || sending) {
      return;
    }

    setSending(true);
    setSendError(false);

    const materialsList = selectedMaterials
      .map((material) => `• ${material.name} (${LEVEL_LABEL[material.level] ?? material.level})`)
      .join('\n');

    try {
      await emailjs.send(
        'service_uxh1yls',
        'template_r5j7f8l',
        {
          email: CONFIG.ORDER_RECIPIENT_EMAIL,
          title: form.institutionName,
          managerName: form.managerName,
          institutionName: form.institutionName,
          institutionEmail: form.institutionEmail,
          schoolAddress: form.schoolAddress,
          contactName: form.contactName,
          contactPhone: form.contactPhone,
          dream: form.dream.trim() || '—',
          materialsList,
        },
        { publicKey: '2XIi7Y0Fb3gS3A_XE' }
      );

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section id="order" className="section order">
        <div className="container">
          <div className="order__done">
            <span className="order__done-icon" aria-hidden="true">
              ✓
            </span>
            <h2>סיימנו :)</h2>
            <p>
              הצוות שלנו יטפל בהזמנתך בהקדם
              <br />
              ומיד לאחר החגים אי״ה יגיעו למייל שלך
              <br />
              מצגות הלומדה שבחרת מוכנות להפעלה.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="section order">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">הזמנת לומדות</h2>
          <p className="section__subtitle">
            מלאו את פרטי המוסד ובחרו עד {maxCount} לומדות. ההזמנה תישלח ישירות לצוות המאגר.
          </p>
        </div>

        <form className="order__card" onSubmit={handleSubmit}>
          <section className="order__block">
            <h3 className="order__block-title">
              <span className="order__step">1</span>
              פרטי המוסד
            </h3>

            <div className="order__grid">
              <label className="field">
                <span className="field__label">שם מנהל/ת</span>
                <input
                  className="field__input"
                  type="text"
                  value={form.managerName}
                  onChange={updateField('managerName')}
                  placeholder="שם מנהל/ת"
                  required
                />
              </label>

              <label className="field">
                <span className="field__label">שם המוסד</span>
                <input
                  className="field__input"
                  type="text"
                  value={form.institutionName}
                  onChange={updateField('institutionName')}
                  placeholder="שם בית הספר / המוסד"
                  required
                />
              </label>

              <label className="field field--full">
                <span className="field__label">כתובת בית הספר</span>
                <input
                  className="field__input"
                  type="text"
                  value={form.schoolAddress}
                  onChange={updateField('schoolAddress')}
                  placeholder="רחוב, מספר ועיר"
                  required
                />
              </label>

              <label className="field">
                <span className="field__label">שם איש קשר</span>
                <input
                  className="field__input"
                  type="text"
                  value={form.contactName}
                  onChange={updateField('contactName')}
                  placeholder="שם מלא"
                  required
                />
              </label>

              <label className="field">
                <span className="field__label">טלפון של איש קשר</span>
                <input
                  className="field__input"
                  type="tel"
                  value={form.contactPhone}
                  onChange={updateField('contactPhone')}
                  placeholder="050-0000000"
                  required
                />
              </label>

              <label className="field field--full">
                <span className="field__label">כתובת אימייל</span>
                <input
                  className="field__input"
                  type="email"
                  value={form.institutionEmail}
                  onChange={updateField('institutionEmail')}
                  placeholder="name@school.org.il"
                  required
                />
              </label>
            </div>
          </section>

          <section className="order__block">
            <div className="order__block-head">
              <h3 className="order__block-title">
                <span className="order__step">2</span>
                בחירת לומדות
              </h3>
              <span className={`order__counter ${isFull ? 'is-full' : ''}`}>
                {selectedCount} / {maxCount} נבחרו
              </span>
            </div>

            <div className={`combo ${pickerOpen ? 'is-open' : ''}`} ref={comboRef}>
              <div
                className="combo__control"
                role="combobox"
                aria-expanded={pickerOpen}
                aria-haspopup="listbox"
                aria-controls="materials-listbox"
                tabIndex={0}
                onClick={() => setPickerOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setPickerOpen((open) => !open);
                  }
                }}
              >
                <div className="combo__values">
                  {selectedCount === 0 ? (
                    <span className="combo__placeholder">בחרו לומדות להזמנה…</span>
                  ) : (
                    selectedMaterials.map((material) => (
                      <span className="combo__chip" key={material.id}>
                        <span className="combo__chip-level">
                          {LEVEL_LABEL[material.level] ?? material.level}
                        </span>
                        <span className="combo__chip-name">{material.name}</span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleMaterial(material.id);
                          }}
                          aria-label={`הסרת ${material.name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <span className="combo__meta">
                  <span className={`combo__count ${isFull ? 'is-full' : ''}`}>
                    {selectedCount} / {maxCount}
                  </span>
                  <span className="combo__chevron" aria-hidden="true">
                    <svg viewBox="0 0 16 16">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4 6 4 4 4-4"
                      />
                    </svg>
                  </span>
                </span>
              </div>

              {pickerOpen && (
                <div className="combo__panel">
                  <div className="picker__toolbar">
                    <div className="picker__search">
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M8.5 3a5.5 5.5 0 0 1 4.383 8.82l3.148 3.15a1 1 0 0 1-1.414 1.414l-3.149-3.148A5.5 5.5 0 1 1 8.5 3Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
                        />
                      </svg>
                      <input
                        ref={searchRef}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="חיפוש לומדה לפי שם, מקצוע או נושא…"
                        aria-label="חיפוש לומדה להוספה"
                      />
                    </div>

                    <div className="picker__filters" role="group" aria-label="סינון לפי שכבה">
                      {FILTERS.map((filter) => (
                        <button
                          type="button"
                          key={filter}
                          className={`picker__filter ${
                            levelFilter === filter ? 'is-active' : ''
                          }`}
                          onClick={() => setLevelFilter(filter)}
                        >
                          {filter === 'all' ? 'הכל' : LEVEL_LABEL[filter]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    id="materials-listbox"
                    className="picker__list"
                    role="listbox"
                    aria-multiselectable="true"
                  >
                    {materials.length === 0 ? (
                      <p className="picker__empty">
                        רשימת הלומדות תופיע כאן לאחר טעינת הקטלוג.
                      </p>
                    ) : filteredMaterials.length === 0 ? (
                      <p className="picker__empty">לא נמצאו לומדות התואמות לחיפוש.</p>
                    ) : (
                      filteredMaterials.map((material) => {
                        const checked = selectedIds.has(material.id);
                        const disabled = !checked && isFull;

                        return (
                          <button
                            type="button"
                            key={material.id}
                            role="option"
                            aria-selected={checked}
                            disabled={disabled}
                            className={`option ${checked ? 'is-selected' : ''} ${
                              disabled ? 'is-disabled' : ''
                            }`}
                            onClick={() => onToggleMaterial(material.id)}
                          >
                            <span className="option__check" aria-hidden="true">
                              <svg viewBox="0 0 16 16">
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m3 8.5 3.5 3.5 6.5-7"
                                />
                              </svg>
                            </span>

                            <span className="option__body">
                              <span className="option__name">{material.name}</span>
                              <span className="option__meta">
                                <span
                                  className={`option__level option__level--${material.level}`}
                                >
                                  {LEVEL_LABEL[material.level] ?? material.level}
                                </span>
                                {material.subject && <span>{material.subject}</span>}
                                {material.topic && <span>· {material.topic}</span>}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {isFull && (
                    <p className="picker__full">
                      הגעתם למספר הלומדות המרבי. הסירו לומדה כדי לבחור אחרת.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="order__block">
            <h3 className="order__block-title">
              <span className="order__step">3</span>
              שתפו אותנו
            </h3>

            <label className="field">
              <span className="field__label">
                יש לך חלום ל״לומדה״ חדשה ומעניינת?  
              </span>
              <textarea
                className="field__input field__textarea"
                value={form.dream}
                onChange={updateField('dream')}
                placeholder="ספרו לנו על הרעיון, הנושא או שכבת הגיל שהייתם רוצים לראות במאגר…"
                rows={4}
              />
              <span className="field__hint">לא חובה — כל רעיון עוזר לנו לפתח את המאגר.</span>
            </label>
          </section>

          <div className="order__footer">
            <button
              type="submit"
              className="btn btn--primary order__submit"
              disabled={!isFormValid || sending}
            >
              {sending ? 'שולח…' : 'שליחת הזמנה'}
            </button>

            {!isFormValid && !sending && (
              <p className="order__foot-note">
                יש למלא את כל השדות ולבחור לפחות לומדה אחת.
              </p>
            )}

            {sendError && (
              <p className="order__foot-error">
                שליחת ההזמנה נכשלה. בדקו את החיבור לאינטרנט ונסו שוב.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default OrderForm;
