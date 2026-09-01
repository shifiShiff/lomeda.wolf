import './Tabs.css';
import type { EducationLevel } from '../types';

interface TabsProps {
  activeLevel: EducationLevel;
  onChange: (level: EducationLevel) => void;
  elementaryCount: number;
  highSchoolCount: number;
}

const Tabs = ({ activeLevel, onChange, elementaryCount, highSchoolCount }: TabsProps) => {
  return (
    <div className="tabs" role="tablist" aria-label="בחירת שכבת גיל">
      <button
        type="button"
        role="tab"
        aria-selected={activeLevel === 'elementary'}
        className={`tabs__item ${activeLevel === 'elementary' ? 'is-active' : ''}`}
        onClick={() => onChange('elementary')}
      >
        יסודי
        <span className="tabs__count">{elementaryCount}</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeLevel === 'highSchool'}
        className={`tabs__item ${activeLevel === 'highSchool' ? 'is-active' : ''}`}
        onClick={() => onChange('highSchool')}
      >
        תיכון
        <span className="tabs__count">{highSchoolCount}</span>
      </button>
    </div>
  );
};

export default Tabs;
