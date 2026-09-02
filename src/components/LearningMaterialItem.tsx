import { useId, useState } from 'react';
import './LearningMaterialItem.css';
import type { LearningMaterial } from '../types';

interface LearningMaterialItemProps {
  material: LearningMaterial;
}

const LEVEL_LABEL: Record<string, string> = {
  elementary: 'יסודי',
  highSchool: 'תיכון',
};

const LearningMaterialItem = ({ material }: LearningMaterialItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  const facts = [
    { label: 'מקצוע', value: material.subject },
    { label: 'נושא', value: material.topic },
    { label: 'קהל יעד', value: material.targetAudience },
  ].filter((fact) => fact.value);

  return (
    <div className={`material-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="material-item__toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="material-item__main">
          <span className="material-item__title-row">
            <span
              className={`material-item__level material-item__level--${material.level}`}
            >
              {LEVEL_LABEL[material.level] ?? material.level}
            </span>
            <span className="material-item__name">{material.name}</span>
          </span>

          {facts.length > 0 && (
            <span className="material-item__facts">
              {facts.map((fact) => (
                <span className="material-item__fact" key={fact.label}>
                  <span className="material-item__fact-label">{fact.label}</span>
                  <span className="material-item__fact-value">{fact.value}</span>
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="material-item__chevron" aria-hidden="true">
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
      </button>

      <div id={panelId} className="material-item__panel" role="region" hidden={!isOpen}>
        <div className="material-item__section">
          <h4 className="material-item__section-title">תיאור הלומדה</h4>
          <p className="material-item__description">
            {material.description || 'לא הוזן תיאור עבור לומדה זו.'}
          </p>
        </div>

        <div className="material-item__section">
          <h4 className="material-item__section-title">יוצרות הלומדה</h4>
          {material.creators.length > 0 ? (
            <ul className="material-item__creators">
              {material.creators.map((creator, index) => (
                <li key={index}>
                  <span className="material-item__creator-name">{creator.name}</span>
                  {creator.phone && (
                    <a
                      className="material-item__creator-phone"
                      href={`tel:${creator.phone.replace(/[^\d+]/g, '')}`}
                    >
                      {creator.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="material-item__description">לא הוזנו פרטי יוצרות.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningMaterialItem;
