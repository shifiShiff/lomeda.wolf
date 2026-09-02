import './Hero.css';
import type { EducationLevel } from '../types';

interface HeroProps {
  elementaryCount: number;
  highSchoolCount: number;
  onSelectLevel: (level: EducationLevel) => void;
}

const Hero = ({ elementaryCount, highSchoolCount, onSelectLevel }: HeroProps) => {
  const total = elementaryCount + highSchoolCount;

  const stats = [
    { label: 'סה״כ לומדות', value: total },
    { label: 'יסודי', value: elementaryCount },
    { label: 'תיכון', value: highSchoolCount },
  ];

  return (
    <section id="top" className="hero">
      <div className="hero__aurora" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__badge">
            <span className="hero__badge-dot" />
            מרכז חדשנות וסימולציה · בית אהל אברהם
          </span>

          <h1 className="hero__title">
            {/* פרויקט לומדות */}
            <span className="hero__title-grad">פרויקט "לומדות"</span>
            <span className="hero__title-text">מבית סמינר הרב וולף בשיתוף מרכז 'יכולות' </span>
          </h1>

          <div className="hero__lead">
            <p className="hero__lead-greet">מנהלת יקרה!</p>
            <p>
              במענה לפניות הרבות, אנו שמחות להעניק לך מתנת פז לתשפ״ז :)
            </p>
            <ol className="hero__lead-steps">
              <li>
                היכנסי לדף ״לומדות״ המתאים עבורך —{' '}
                <a
                  href="#catalog"
                  onClick={() => onSelectLevel('elementary')}
                >
                  יסודי
                </a>{' '}
                או{' '}
                <a
                  href="#catalog"
                  onClick={() => onSelectLevel('highSchool')}
                >
                  תיכון
                </a>
              </li>
              <li>בחרי 4 ״לומדות״ מתנה</li>
              <li>
                מלאי <a href="#order">כאן</a> טופס הזמנה ללא תשלום :)
              </li>
            </ol>
            <p className="hero__lead-note">*ניתן להזמין עד כ״ט באלול בלבד!</p>
          </div>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#order">
              להזמנת לומדות
            </a>
            <a className="btn btn--ghost" href="#catalog">
              לעיון בקטלוג
            </a>
          </div>

          <dl className="hero__stats">
            {stats.map((stat) => (
              <div className="hero__stat" key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value > 0 ? stat.value : '—'}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual">
          <div className="hero__brandcard">
            <span className="hero__brandcard-label">מבית</span>

            <img
              className="hero__brandcard-logo hero__brandcard-logo--abraham"
              src="/wolf-logo.png"
              alt="סמינר ע״ש הרב י׳ א׳ וולף — מרכז הכשרה והשתלמויות"
            />
            <span className="hero__brandcard-divider" aria-hidden="true" />



            <img
              className="hero__brandcard-logo"
              src="/yecholot-logo.png"
              alt="יכולות — מרכז חדשנות וסימולציה"
            />
            <p className="hero__brandcard-text">מרכז חדשנות וסימולציה · בית אהל אברהם</p>
          </div>

          <div className="hero__orb hero__orb--1" aria-hidden="true" />
          <div className="hero__orb hero__orb--2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
