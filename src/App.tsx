import { useCallback, useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
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

  const isSelectionDisabled = useCallback(
    (id: string) => selectedIds.length >= CONFIG.MAX_SELECTED_MATERIALS && !selectedIds.includes(id),
    [selectedIds]
  );

  return (
    <div className="app">
      {isUsingPlaceholderConfig() && <ConfigWarningBanner />}

      <Header />

      <main>
        <section className="container catalog">
          <Tabs
            activeLevel={activeLevel}
            onChange={setActiveLevel}
            elementaryCount={elementary.length}
            highSchoolCount={highSchool.length}
          />

          <div className="catalog__list">
            <LearningMaterialList
              materials={currentMaterials}
              selectedIds={selectedIds}
              isSelectionDisabled={isSelectionDisabled}
              onToggleSelect={toggleSelect}
              isLoading={isLoading}
              error={error}
            />
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
