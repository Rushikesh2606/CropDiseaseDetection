/**
 * HeroActions — CTA pill "Analyze a Leaf" + text link "Browse Diseases".
 * Uses spec-exact styling, arrows, and hover colors.
 */
import { Link } from 'react-router-dom';
import { CtaArrowIcon, ChevronIcon } from './icons';

export function HeroActions({ id = 'pg-actions', isHidden = false }) {
  return (
    <div
      className={`pg-actions ${isHidden ? 'pg-entrance-hidden' : ''}`}
      id={id}
    >
      {/* Primary CTA pill */}
      <Link to="/analyze" className="pg-cta-pill" aria-label="Analyze a leaf">
        <div className="pg-cta-disc">
          <CtaArrowIcon />
        </div>
        <span className="pg-cta-text">Analyze a Leaf</span>
      </Link>

      {/* Text link */}
      <Link to="/diseases" className="pg-text-link">
        Browse Diseases
        <ChevronIcon width={10} height={6} stroke="currentColor" strokeWidth={1.4} />
      </Link>
    </div>
  );
}
