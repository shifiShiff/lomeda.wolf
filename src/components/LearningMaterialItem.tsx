import { useId, useState } from 'react';
import './LearningMaterialItem.css';
import type { LearningMaterial } from '../types';

interface LearningMaterialItemProps {
  material: LearningMaterial;
  isSelected: boolean;
  isSelectionDisabled: boolean;
  onToggleSelect: (id: string) => void;
}

const LearningMaterialItem = ({
  material,
  isSelected,
  isSelectionDisabled,
  onToggleSelect,
}: LearningMaterialItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`material-item ${isOpen ? 'is-open' : ''}`}>
      <div className="material-item__header">
        <button
          type="button"
          className="material-item__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="material-item__chevron" aria-hidden="true">
            ‹
          </span>
          <span className="material-item__name">{material.name}</span>
        </button>

        <label
          className={`material-item__checkbox ${
            isSelectionDisabled && !isSelected ? 'is-disabled' : ''
          }`}
        >
          <input
            type="checkbox"
            checked={isSelected}
            disabled={isSelectionDisabled && !isSelected}
            onChange={() => onToggleSelect(material.id)}
            aria-label={`בחרו לומדה: ${material.name}`}
          />
          <span>לבחירה בהזמנה</span>
        </label>
      </div>

      <div
        id={panelId}
        className="material-item__panel"
        role="region"
        hidden={!isOpen}
      >
        <dl className="material-item__details">
          <div className="material-item__detail">
            <dt>מקצוע</dt>
            <dd>{material.subject || '—'}</dd>
          </div>
          <div className="material-item__detail">
            <dt>נושא</dt>
            <dd>{material.topic || '—'}</dd>
          </div>
          <div className="material-item__detail">
            <dt>קהל יעד</dt>
            <dd>{material.targetAudience || '—'}</dd>
          </div>
          <div className="material-item__detail material-item__detail--full">
            <dt>יוצרות הלומדה</dt>
            <dd>
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
                '—'
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default LearningMaterialItem;
