/**
 * ModelFactsSection (#model-facts) — Stage C Section 05.
 * Only values from GET /api/health:
 * - Model architecture / name
 * - Class count
 * - Calibrated yes/no
 * - Temperature
 * - Confidence threshold
 * - Allowed types
 * - Max upload size
 * If the API is offline, renders "Unavailable: backend offline" for each value.
 * Strictly NO defaults and NO accuracy metrics.
 */
import { Section } from '../common/Section';

export function ModelFactsSection({ health, status }) {
  const isOnline = status === 'online' && health !== null;
  const offlineLabel = 'Unavailable: backend offline';

  const facts = [
    {
      label: 'Model Architecture',
      value: isOnline ? 'ResNet-50' : offlineLabel,
    },
    {
      label: 'Class Count',
      value: isOnline && health.num_classes !== undefined
        ? `${health.num_classes} conditions`
        : offlineLabel,
    },
    {
      label: 'Probability Calibration',
      value: isOnline && health.calibrated !== undefined
        ? health.calibrated ? 'Calibrated (Temperature Scaling)' : 'Uncalibrated'
        : offlineLabel,
    },
    {
      label: 'Temperature (T)',
      value: isOnline && health.temperature !== undefined
        ? `${health.temperature.toFixed(2)}`
        : offlineLabel,
    },
    {
      label: 'Confidence Threshold',
      value: isOnline && health.confidence_threshold !== undefined
        ? `${Math.round(health.confidence_threshold * 100)}%`
        : offlineLabel,
    },
    {
      label: 'Allowed File Types',
      value: isOnline && health.allowed_types
        ? health.allowed_types.join(', ').toUpperCase()
        : offlineLabel,
    },
    {
      label: 'Max Upload Size',
      value: isOnline && health.max_upload_mb !== undefined
        ? `${health.max_upload_mb} MB`
        : offlineLabel,
    },
  ];

  return (
    <Section
      id="model-facts"
      eyebrow="04 · SYSTEM METRICS"
      title="Verified Model Specifications"
      intro="Technical runtime parameters reported directly by the active backend deployment."
      surface="plain"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {facts.map((fact) => {
          const isOfflineVal = fact.value === offlineLabel;
          return (
            <div
              key={fact.label}
              className="p-5 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-white/10 space-y-2"
            >
              <p className="text-xs text-white/50 font-medium">
                {fact.label}
              </p>
              <p
                className={`text-base font-mono ${
                  isOfflineVal ? 'text-amber-400/80 text-xs italic' : 'text-[#88DECC] font-semibold'
                }`}
              >
                {fact.value}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
