/**
 * usePrediction — handles file upload lifecycle with AbortController support.
 */
import { useState, useRef, useCallback } from 'react';
import { predictLeaf } from '../services/predictionService';

export function usePrediction() {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const abortRef                  = useRef(null);

  const selectFile = useCallback((f) => {
    // Revoke previous URL
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setResult(null);
    setError(null);
  }, [preview]);

  const analyze = useCallback(async () => {
    if (!file) return;

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await predictLeaf(file, controller.signal);
      setResult(data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [file]);

  const cancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    cancel();
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, [cancel, preview]);

  return { file, preview, result, loading, error, selectFile, analyze, cancel, reset };
}
