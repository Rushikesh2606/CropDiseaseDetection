/**
 * NavPill — 442×47 black pill with absolutely placed links
 * and small chevron for active route, plus cream PartnerPill.
 */
import { Link, useLocation } from 'react-router-dom';
import { ChevronIcon } from './icons';
import { PartnerPill } from './PartnerPill';

export function NavPill({ id = 'pg-nav', isHidden = false }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Analyze', to: '/analyze' },
    { label: 'Diseases', to: '/diseases' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Safety', to: '/#safety' },
  ];

  const handleAnchorClick = (e, to) => {
    if (to.startsWith('/#')) {
      const hash = to.slice(2);
      if (currentPath === '/') {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`pg-nav-pill ${isHidden ? 'pg-entrance-hidden' : ''}`}
      aria-label="Primary navigation"
      id={id}
    >
      <div className="pg-nav-links">
        {links.map((link) => {
          const isActive = currentPath === link.to;
          return (
            <Link
              key={link.label}
              to={link.to}
              className="pg-nav-link"
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => handleAnchorClick(e, link.to)}
            >
              {link.label}
              {isActive && (
                <ChevronIcon
                  className="pg-nav-chevron"
                  width={11}
                  height={6}
                  stroke="#7CCBBA"
                  strokeWidth={1.4}
                />
              )}
            </Link>
          );
        })}
      </div>
      <PartnerPill to="/analyze" label="Analyze Leaf" />
    </nav>
  );
}
