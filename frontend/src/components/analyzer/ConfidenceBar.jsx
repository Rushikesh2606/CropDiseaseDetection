/** Animated confidence progress bar */
export function ConfidenceBar({ confidence, color = 'teal', label }) {
  const pct = Math.round(confidence * 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-white/50 mb-1">
          <span className="truncate max-w-[70%]">{label}</span>
          <span className="font-mono font-semibold text-white/70">{pct}%</span>
        </div>
      )}
      <div
        className="h-2 rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label}: ${pct}%` : `${pct}%`}
      >
        <div
          className={`h-full rounded-full progress-bar-fill ${
            color === 'amber' ? 'bg-amber-400' : 'bg-teal'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
