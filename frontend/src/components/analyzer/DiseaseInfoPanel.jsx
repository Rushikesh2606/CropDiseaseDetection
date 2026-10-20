/**
 * DiseaseInfoPanel — shows disease info from the backend.
 * When confident: full panel.
 * When low-confidence: collapsed "If the top match is correct".
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useDiseaseDetail } from '../../hooks/useDiseases';

function InfoSection({ title, items, color = 'teal' }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 text-${color}-400/80`}>
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${color}-500/60 shrink-0`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiseaseInfoPanel({ classId, isConfident, isHealthy }) {
  const { disease, loading, error } = useDiseaseDetail(classId);
  const [expanded, setExpanded] = useState(false);

  if (loading) return (
    <div className="glass-card p-5 animate-pulse">
      <div className="h-4 bg-white/10 rounded-sm w-1/3 mb-3" />
      <div className="h-3 bg-white/5 rounded-sm w-full mb-2" />
      <div className="h-3 bg-white/5 rounded-sm w-4/5" />
    </div>
  );

  if (error || !disease) return null;

  const panelContent = (
    <div className="space-y-5">
      {/* Summary */}
      <p className="text-sm text-white/70 leading-relaxed">{disease.summary}</p>

      {isHealthy ? (
        <>
          <InfoSection title="General Care Tips" items={disease.management} />
          <InfoSection title="Prevention" items={disease.prevention} />
        </>
      ) : (
        <>
          <InfoSection title="Symptoms" items={disease.symptoms} color="teal" />
          <InfoSection title="Causes / Risk Factors" items={disease.causes} color="pine" />
          <InfoSection title="Management" items={disease.management} color="teal" />
          <InfoSection title="Prevention" items={disease.prevention} color="teal" />
          {disease.notes && (
            <div className="text-xs text-white/40 italic border-t border-white/5 pt-3">
              {disease.notes}
            </div>
          )}
        </>
      )}

      <Link
        to={`/diseases/${encodeURIComponent(classId)}`}
        className="inline-flex items-center gap-1.5 text-sm text-teal hover:underline mt-2"
      >
        Full disease details
        <ExternalLink size={12} aria-hidden="true" />
      </Link>
    </div>
  );

  if (!isConfident) {
    // Collapsed by default with "If the top match is correct" label
    return (
      <div className="glass-card p-5 border-white/10" id="disease-info-panel">
        <button
          id="disease-info-toggle"
          className="w-full flex items-center justify-between text-left"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-controls="disease-info-body"
        >
          <div>
            <span className="text-xs text-amber-400/70 uppercase tracking-wider font-semibold">
              If the top match is correct
            </span>
            <p className="text-sm text-white/60 mt-0.5">
              Information about <em>{disease.label}</em>
            </p>
          </div>
          {expanded
            ? <ChevronUp size={16} className="text-white/40 shrink-0" aria-hidden="true" />
            : <ChevronDown size={16} className="text-white/40 shrink-0" aria-hidden="true" />
          }
        </button>
        {expanded && (
          <div id="disease-info-body" className="mt-4 pt-4 border-t border-white/10">
            {panelContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-5" id="disease-info-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{disease.label}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isHealthy
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isHealthy ? 'Healthy' : 'Disease Detected'}
        </span>
      </div>
      {panelContent}
    </div>
  );
}
