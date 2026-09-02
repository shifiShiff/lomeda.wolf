import { useCallback, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Tabs from './components/Tabs';
import LearningMaterialList from './components/LearningMaterialList';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import ConfigWarningBanner from './components/ConfigWarningBanner';
import { useLearningMaterials } from './hooks/useLearningMaterials';
import { CONFIG, isUsingPlaceholderConfig } from './config';
import type { EducationLevel } from './types';

const App = () => {
  const [activeLevel, setActiveLevel] = useState<EducationLevel>('elementary');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { elementary, highSchool, isLoading, error } = useLearningMaterials();

  const allMaterials = useMemo(() => [...elementary, ...highSchool], [elementary, highSchool]);

  const currentMaterials = activeLevel === 'elementary' ? elementary : highSchool;

  const selectedMaterials = useMemo(
    () => allMaterials.filter((material) => selectedIds.includes(material.id)),
    [allMaterials, selectedIds]
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((existingId) => existingId !== id);
      }
      if (prev.length >= CONFIG.MAX_SELECTED_MATERIALS) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  return (
    <div className="app">
      {isUsingPlaceholderConfig() && <ConfigWarningBanner />}

      <Header />

      <main>
        <Hero
          elementaryCount={elementary.length}
          highSchoolCount={highSchool.length}
          onSelectLevel={setActiveLevel}
        />

        <section id="catalog" className="section catalog">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title"> קטלוג הלומדות</h2>
              <p className="section__subtitle">
                עיינו במאגר לפי שכבת גיל, מקצוע ונושא. בחירת הלומדות להזמנה מתבצעת בטופס שבהמשך העמוד.
              </p>
            </div>

            <Tabs
              activeLevel={activeLevel}
              onChange={setActiveLevel}
              elementaryCount={elementary.length}
              highSchoolCount={highSchool.length}
            />

            <div className="catalog__list">
              <LearningMaterialList
                materials={currentMaterials}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </section>

        <OrderForm
          materials={allMaterials}
          selectedMaterials={selectedMaterials}
          onToggleMaterial={toggleSelect}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
