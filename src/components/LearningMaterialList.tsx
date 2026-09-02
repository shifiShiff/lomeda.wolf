import { useMemo, useState } from 'react';
import './LearningMaterialList.css';
import LearningMaterialItem from './LearningMaterialItem';
import type { LearningMaterial } from '../types';

interface LearningMaterialListProps {
  materials: LearningMaterial[];
  isLoading: boolean;
  error: string | null;
}

const LearningMaterialList = ({ materials, isLoading, error }: LearningMaterialListProps) => {
  const [query, setQuery] = useState('');

  const filteredMaterials = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return materials;
    return materials.filter((material) =>
      [material.name, material.subject, material.topic].some((field) =>
        field.toLowerCase().includes(normalized)
      )
    );
  }, [materials, query]);

  if (isLoading) {
    return (
      <div className="material-state">
        <div className="material-state__spinner" aria-hidden="true" />
        <p>טוען לומדות מהמאגר…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="material-state material-state--error">
        <p>לא ניתן היה לטעון את הנתונים כרגע.</p>
        <p className="material-state__detail">{error}</p>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="material-state">
        <p>לא נמצאו לומדות עבור שכבה זו כרגע.</p>
      </div>
    );
  }

  return (
    <div className="material-list">
      <div className="material-list__search">
        <svg className="material-list__search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8.5 3a5.5 5.5 0 0 1 4.383 8.82l3.148 3.15a1 1 0 0 1-1.414 1.414l-3.149-3.148A5.5 5.5 0 1 1 8.5 3Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"
          />
        </svg>
        <input
          type="search"
          placeholder="חיפוש לפי שם לומדה, מקצוע או נושא…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="חיפוש לומדות"
        />
      </div>

      {/* <p className="material-list__note">
        זהו תצוגה בלבד. לבחירת לומדות להזמנה עברו לטופס
        {' '}
        <a href="#order">הזמנת לומדות</a>.
      </p> */}

      {filteredMaterials.length === 0 ? (
        <div className="material-state">
          <p>לא נמצאו תוצאות התואמות לחיפוש "{query}".</p>
        </div>
      ) : (
        <div className="material-list__items">
          {filteredMaterials.map((material) => (
            <LearningMaterialItem key={material.id} material={material} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningMaterialList;
