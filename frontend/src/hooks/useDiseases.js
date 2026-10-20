/**
 * useDiseases — fetches disease list and single disease detail.
 */
import { useState, useEffect } from 'react';
import { getDiseases, getDiseaseDetail } from '../services/diseaseService';

export function useDiseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDiseases();
        setDiseases(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { diseases, loading, error };
}

export function useDiseaseDetail(classId) {
  const [disease, setDisease]  = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    setDisease(null);
    setError(null);
    (async () => {
      try {
        const data = await getDiseaseDetail(classId);
        setDisease(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [classId]);

  return { disease, loading, error };
}
