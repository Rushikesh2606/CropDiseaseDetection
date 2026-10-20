/**
 * LogoMark — 104×46 glass pill with 46px disc containing 7-stroke tree,
 * and mirrored moth in #315352 to its right.
 * Matches HERO_SPEC character-for-character.
 */
import { Link } from 'react-router-dom';
import { DeltaTreeIcon } from './icons';
import { Moth } from './Moth';

export function LogoMark({ id = 'pg-logo', isHidden = false }) {
  return (
    <Link
      to="/"
      className={`pg-logo-pill ${isHidden ? 'pg-entrance-hidden' : ''}`}
      id={id}
      aria-label="PlantGuard AI home"
    >
      <div className="pg-logo-disc">
        <DeltaTreeIcon />
      </div>
      <Moth />
    </Link>
  );
}
