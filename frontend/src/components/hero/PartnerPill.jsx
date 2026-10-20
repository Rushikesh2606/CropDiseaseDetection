/**
 * PartnerPill — Cream pill with dark pine disc and white right chevron.
 * Spec-exact dimensions, colors, and hover transitions.
 */
import { Link } from 'react-router-dom';
import { PartnerArrowIcon } from './icons';

export function PartnerPill({ to = '/analyze', label = 'Analyze Leaf' }) {
  return (
    <Link to={to} className="pg-partner-pill" aria-label={label}>
      <div className="pg-partner-disc">
        <PartnerArrowIcon />
      </div>
      <span className="pg-partner-text">{label}</span>
    </Link>
  );
}
