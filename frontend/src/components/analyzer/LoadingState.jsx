/** LoadingState — spinner with cancel action */
import { Loader2 } from 'lucide-react';

export function LoadingState({ onCancel }) {
  return (
    <div
      id="loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="glass-card p-10 flex flex-col items-center gap-5 text-center"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-teal/20" />
        <Loader2
          size={56}
          className="absolute inset-0 text-teal spinner"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <p className="font-semibold text-white mb-1">Analyzing your leaf…</p>
        <p className="text-sm text-white/50">
          Running inference through ResNet-50
        </p>
      </div>
      {onCancel && (
        <button
          id="cancel-analyze-btn"
          onClick={onCancel}
          className="text-xs text-white/40 hover:text-white/70 underline transition-colors"
          aria-label="Cancel analysis"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
