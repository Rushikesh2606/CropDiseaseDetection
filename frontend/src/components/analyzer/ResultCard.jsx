/** ResultCard — confident vs uncertain presentation */
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ConfidenceBar } from './ConfidenceBar';
import { TopPredictions } from './TopPredictions';
import { LowConfidenceWarning } from './LowConfidenceWarning';
import { DiseaseInfoPanel } from './DiseaseInfoPanel';

function HealthBadge({ isHealthy }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isHealthy
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}
    >
      {isHealthy
        ? <CheckCircle size={11} aria-hidden="true" />
        : <AlertCircle size={11} aria-hidden="true" />
      }
      {isHealthy ? 'Healthy' : 'Disease Detected'}
    </span>
  );
}

export function ResultCard({ result }) {
  const isConfident = result.status === 'confident';
  const isHealthy   = result.predicted_class?.toLowerCase().includes('healthy');
  const pct         = Math.round(result.confidence * 100);
  const thresh      = Math.round(result.threshold * 100);

  return (
    <div
      id="result-card"
      className="space-y-6"
      role="region"
      aria-label="Analysis results"
      aria-live="polite"
    >
      {/* Header */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              {isConfident ? 'Identified Condition' : 'Top Possible Match'}
            </p>
            <h2 className="text-xl font-bold text-white leading-tight">
              {result.label}
            </h2>
            <p className="text-xs text-white/30 mt-0.5 font-mono">
              {result.predicted_class}
            </p>
          </div>
          <HealthBadge isHealthy={isHealthy} />
        </div>

        {/* Confidence bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/50">
            <span>Confidence</span>
            <span className="font-mono font-semibold text-white/80">{pct}%</span>
          </div>
          <ConfidenceBar
            confidence={result.confidence}
            color={isConfident ? 'teal' : 'amber'}
          />
          <div className="flex justify-between text-xs text-white/30">
            <span>Threshold: {thresh}%</span>
            <span>
              {result.calibrated ? '✓ Calibrated' : 'Uncalibrated'}
            </span>
          </div>
        </div>

        {/* Inference time */}
        <p className="text-xs text-white/25">
          Inference: {result.inference_time_ms.toFixed(0)} ms
        </p>
      </div>

      {/* Uncertainty warning (replaces confident header when below threshold) */}
      {!isConfident && (
        <LowConfidenceWarning
          confidence={result.confidence}
          threshold={result.threshold}
        />
      )}

      {/* Top predictions */}
      <div className="glass-card p-5">
        <TopPredictions
          predictions={result.top_predictions}
          threshold={result.threshold}
        />
      </div>

      {/* Disease info */}
      <DiseaseInfoPanel
        classId={result.predicted_class}
        isConfident={isConfident}
        isHealthy={isHealthy}
      />
    </div>
  );
}
