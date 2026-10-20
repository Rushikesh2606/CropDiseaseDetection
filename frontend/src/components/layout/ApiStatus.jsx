/** ApiStatus — compact glass pill showing model status */
import { useApiHealth } from '../../hooks/useApiHealth';

export function ApiStatus() {
  const { status } = useApiHealth();

  const label =
    status === 'online'   ? 'Model online' :
    status === 'offline'  ? 'Model offline' :
                            'Checking…';

  return (
    <div
      id="api-status-pill"
      className="api-status-pill"
      role="status"
      aria-live="polite"
      aria-label={`API status: ${label}`}
    >
      <span className={`api-status-dot api-status-dot--${status}`} aria-hidden="true" />
      {label}
    </div>
  );
}
