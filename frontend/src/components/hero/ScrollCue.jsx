/**
 * ScrollCue — Bottom-right vertical scroll prompt with teal chevron.
 * Links to #how-it-works.
 */
import { ChevronIcon } from './icons';

export function ScrollCue({ id = 'pg-scroll-cue', isHidden = false }) {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#how-it-works"
      className={`pg-scroll-cue ${isHidden ? 'pg-entrance-hidden' : ''}`}
      id={id}
      aria-label="Scroll to How It Works section"
      onClick={handleClick}
    >
      <ChevronIcon
        className="pg-scroll-cue__chevron"
        width={11}
        height={6}
        stroke="#88DECC"
        strokeWidth={1.5}
      />
      <span className="pg-scroll-cue__label">Scroll for Details</span>
    </a>
  );
}
