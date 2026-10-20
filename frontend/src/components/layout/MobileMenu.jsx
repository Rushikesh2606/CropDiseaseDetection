/**
 * MobileMenu — Spec-exact mobile navigation overlay.
 * Black rounded panel under header, hidden until .is-open.
 * Links stack at 48px tall, 17px type. Partner sits under links.
 */
import { Link, useLocation } from 'react-router-dom';
import { PartnerArrowIcon } from '../hero/icons';

export function MobileMenu({ isOpen, onClose, panelRef }) {
  const location = useLocation();

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Analyze', to: '/analyze' },
    { label: 'Diseases', to: '/diseases' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Safety', to: '/#safety' },
  ];

  const handleLinkClick = (to) => {
    onClose();
    if (to.startsWith('/#') && location.pathname === '/') {
      const el = document.getElementById(to.slice(2));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={panelRef}
      className={`pg-mobile-nav ${isOpen ? 'is-open' : ''}`}
      id="pg-mobile-nav"
      aria-label="Mobile navigation"
      aria-hidden={!isOpen}
    >
      {links.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          className="pg-mobile-nav__link"
          onClick={() => handleLinkClick(link.to)}
        >
          {link.label}
        </Link>
      ))}

      {/* Partner under links */}
      <Link
        to="/analyze"
        className="pg-mobile-partner"
        onClick={() => handleLinkClick('/analyze')}
      >
        <div
          className="pg-partner-disc"
          style={{ width: '32px', height: '32px' }}
        >
          <PartnerArrowIcon />
        </div>
        <span
          style={{
            fontFamily: 'var(--pg-font-text)',
            fontSize: '15px',
            color: 'var(--pg-ink-2)',
          }}
        >
          Analyze Leaf
        </span>
      </Link>
    </nav>
  );
}
