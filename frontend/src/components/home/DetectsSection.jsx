/**
 * DetectsSection (#detects) — Stage C Section 04.
 * Grid of the 15 classes from GET /api/classes,
 * each linking to /diseases/:classId with healthy/diseased badge.
 * If backend is offline, renders "Unavailable: backend offline".
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../common/Section';
import { getClasses } from '../../services/diseaseService';
import { ArrowUpRight } from 'lucide-react';

export function DetectsSection() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    getClasses()
      .then((data) => {
        if (mounted) {
          setClasses(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setOffline(true);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Section
      id="detects"
      eyebrow="03 · DIAGNOSTIC SCOPE"
      title="Supported Crops & Recognised Conditions"
      intro="PlantGuard AI evaluates leaf samples against 15 specific conditions across key agricultural crops."
      surface="glass"
    >
      {loading ? (
        <div className="py-12 text-center text-sm text-white/50 animate-pulse">
          Loading diagnostic classes...
        </div>
      ) : offline || classes.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
          <p className="text-sm font-medium text-white/70">
            Unavailable: backend offline
          </p>
          <p className="text-xs text-white/40">
            Start the backend service to load dynamic class specifications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Link
              key={cls.id || cls.name}
              to={`/diseases/${encodeURIComponent(cls.id || cls.name)}`}
              className="p-5 rounded-2xl bg-[rgba(3,8,11,0.55)] border border-[rgba(136,222,204,0.18)] hover:border-[#88DECC] transition-colors group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#88DECC]/80 font-medium">
                    {cls.crop}
                  </span>
                  <h3 className="text-sm font-medium text-[#F5FAF6] group-hover:text-[#88DECC] transition-colors">
                    {cls.condition || cls.name}
                  </h3>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-white/30 group-hover:text-[#88DECC] transition-colors flex-shrink-0"
                />
              </div>

              <div>
                <span
                  className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    cls.is_healthy
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {cls.is_healthy ? 'Healthy Leaf' : 'Named Condition'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
