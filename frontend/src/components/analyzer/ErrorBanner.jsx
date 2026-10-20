/** ErrorBanner — specific messages for each error type */
import { AlertTriangle, Wifi, ServerCrash, RefreshCw } from 'lucide-react';

function getErrorContent(err) {
  const code = err?.appError?.code || err?.code || 'UNKNOWN';
  const detail = err?.appError?.detail || err?.message || 'An unexpected error occurred.';

  switch (code) {
    case 'MODEL_NOT_LOADED':
      return {
        icon: <ServerCrash size={20} aria-hidden="true" />,
        title: 'Model Not Available',
        message:
          'The AI model has not been loaded on the server. ' +
          'Place best_model.pth at backend/models/ and restart the backend.',
        color: 'red',
      };
    case 'FILE_TOO_LARGE':
      return {
        icon: <AlertTriangle size={20} aria-hidden="true" />,
        title: 'File Too Large',
        message: detail,
        color: 'amber',
      };
    case 'INVALID_TYPE':
      return {
        icon: <AlertTriangle size={20} aria-hidden="true" />,
        title: 'Invalid File Type',
        message: 'Only JPG, PNG, and WEBP images are accepted.',
        color: 'amber',
      };
    case 'EMPTY_FILE':
      return {
        icon: <AlertTriangle size={20} aria-hidden="true" />,
        title: 'Empty File',
        message: 'The uploaded file is empty. Please choose a valid image.',
        color: 'amber',
      };
    case 'CORRUPT_IMAGE':
      return {
        icon: <AlertTriangle size={20} aria-hidden="true" />,
        title: 'Corrupt or Unreadable Image',
        message: 'The image could not be decoded. Upload a valid JPG, PNG, or WEBP.',
        color: 'amber',
      };
    case 'NETWORK_ERROR':
      return {
        icon: <Wifi size={20} aria-hidden="true" />,
        title: 'Network Error',
        message:
          'Could not reach the PlantGuard API. ' +
          'Make sure the backend is running at http://127.0.0.1:8000.',
        color: 'red',
      };
    default:
      if (code.startsWith('HTTP_5')) {
        return {
          icon: <ServerCrash size={20} aria-hidden="true" />,
          title: 'Server Error',
          message: detail,
          color: 'red',
        };
      }
      return {
        icon: <AlertTriangle size={20} aria-hidden="true" />,
        title: 'Analysis Failed',
        message: detail,
        color: 'red',
      };
  }
}

export function ErrorBanner({ error, onRetry }) {
  const { icon, title, message, color } = getErrorContent(error);
  const colorMap = {
    red: {
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      msgColor: 'text-red-200/70',
    },
    amber: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300',
      msgColor: 'text-amber-200/70',
    },
  };
  const c = colorMap[color] || colorMap.red;

  return (
    <div
      id="error-banner"
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border p-5 ${c.border} ${c.bg}`}
    >
      <div className="flex items-start gap-3">
        <span className={`${c.iconColor} mt-0.5 shrink-0`}>{icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${c.titleColor}`}>{title}</h3>
          <p className={`text-sm ${c.msgColor}`}>{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-4 flex justify-end">
          <button
            id="retry-btn"
            onClick={onRetry}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            aria-label="Retry analysis"
          >
            <RefreshCw size={13} aria-hidden="true" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
