import { useMemo, useState } from 'react';
import './LearningMaterialList.css';
import LearningMaterialItem from './LearningMaterialItem';
import type { LearningMaterial } from '../types';

interface LearningMaterialListProps {
  materials: LearningMaterial[];
  selectedIds: string[];
  isSelectionDisabled: (id: string) => boolean;
  onToggleSelect: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

const LearningMaterialList = ({
  materials,
  selectedIds,
  isSelectionDisabled,
  onToggleSelect,
  isLoading,
  error,
}: LearningMaterialListProps) => {
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
        <p>טוען לומדות מהגיליון…</p>
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
        <input
          type="search"
          placeholder="חיפוש לפי שם לומדה, מקצוע או נושא…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="חיפוש לומדות"
        />
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="material-state">
          <p>לא נמצאו תוצאות התואמות לחיפוש "{query}".</p>
        </div>
      ) : (
        <div className="material-list__items">
          {filteredMaterials.map((material) => (
            <LearningMaterialItem
              key={material.id}
              material={material}
              isSelected={selectedIds.includes(material.id)}
              isSelectionDisabled={isSelectionDisabled(material.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningMaterialList;
