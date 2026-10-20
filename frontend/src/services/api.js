/**
 * Axios instance — base URL from env, JSON, timeout.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
  timeout: 60_000,
  headers: { Accept: 'application/json' },
});

// Normalise error bodies so consumers always get { error, detail, code }
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.detail && typeof err.response.data.detail === 'object') {
      // FastAPI passes our error body in detail
      err.appError = err.response.data.detail;
    } else if (err.response?.data) {
      err.appError = {
        error: 'Request Failed',
        detail: err.response.data.detail || err.message,
        code: `HTTP_${err.response.status}`,
      };
    } else {
      err.appError = {
        error: 'Network Error',
        detail: 'Could not reach the PlantGuard API. Is the backend running?',
        code: 'NETWORK_ERROR',
      };
    }
    return Promise.reject(err);
  }
);

export default api;
