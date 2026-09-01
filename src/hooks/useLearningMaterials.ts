import { useCallback, useEffect, useState } from 'react';
import { fetchAllLearningMaterials } from '../services/googleSheetsService';
import type { LearningMaterial } from '../types';

interface UseLearningMaterialsResult {
  elementary: LearningMaterial[];
  highSchool: LearningMaterial[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export const useLearningMaterials = (): UseLearningMaterialsResult => {
  const [elementary, setElementary] = useState<LearningMaterial[]>([]);
  const [highSchool, setHighSchool] = useState<LearningMaterial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllLearningMaterials();
        if (isCancelled) return;
        setElementary(data.elementary);
        setHighSchool(data.highSchool);
      } catch (err) {
        if (isCancelled) return;
        setError(err instanceof Error ? err.message : 'אירעה שגיאה לא צפויה.');
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  return { elementary, highSchool, isLoading, error, reload };
};
