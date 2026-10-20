/** TopPredictions — ranked list with bars */
import { ConfidenceBar } from './ConfidenceBar';

export function TopPredictions({ predictions, threshold }) {
  return (
    <div className="space-y-3" id="top-predictions">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
        Top Predictions
      </h3>
      {predictions.map((p) => (
        <div key={p.rank} className="space-y-1">
          <ConfidenceBar
            confidence={p.confidence}
            label={`${p.rank}. ${p.label}`}
            color={p.confidence >= threshold ? 'teal' : 'amber'}
          />
        </div>
      ))}
    </div>
  );
}
