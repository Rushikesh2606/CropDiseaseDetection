/** LowConfidenceWarning — amber warning when model is uncertain */
import { AlertTriangle } from 'lucide-react';

export function LowConfidenceWarning({ confidence, threshold }) {
  const pct = Math.round(confidence * 100);
  const thresh = Math.round(threshold * 100);
  return (
    <div
      id="low-confidence-warning"
      role="alert"
      aria-live="polite"
      className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={20}
          className="text-amber-400 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div>
          <h3 className="font-semibold text-amber-300 mb-1">
            Model Is Uncertain ({pct}% — below {thresh}% threshold)
          </h3>
          <p className="text-sm text-amber-200/80 mb-3">
            The model could not confidently identify the leaf condition. The results
            below show <strong>possible matches only</strong>, not a diagnosis.
          </p>
          <p className="text-xs text-amber-200/60 font-medium mb-1">
            For a better result, try:
          </p>
          <ul className="text-xs text-amber-200/60 space-y-1 list-disc list-inside">
            <li>Photograph a single leaf on a plain, light background</li>
            <li>Ensure the leaf is in sharp focus and well lit</li>
            <li>Avoid shadows, water droplets, or extreme angles</li>
            <li>Use a photo taken during daylight</li>
          </ul>
          <p className="text-xs text-amber-200/50 mt-3 italic">
            For any management decisions, consult a qualified agricultural expert
            or your local extension service.
          </p>
        </div>
      </div>
    </div>
  );
}
