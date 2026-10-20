/**
 * useApiHealth — polls GET /api/health every 30 s.
 */
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

export function useApiHealth() {
  const [health, setHealth] = useState(null);
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const intervalRef = useRef(null);

  const check = async () => {
    try {
      const { data } = await api.get('/health');
      setHealth(data);
      setStatus(data.model_loaded ? 'online' : 'offline');
    } catch {
      setStatus('offline');
      setHealth(null);
    }
  };

  useEffect(() => {
    check();
    intervalRef.current = setInterval(check, 30_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return { health, status };
}
