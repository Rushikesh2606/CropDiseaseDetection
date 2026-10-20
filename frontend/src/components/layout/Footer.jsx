import { Link } from 'react-router-dom';
import { LogoMark } from '../hero/LogoMark';

export function Footer() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/analyze', label: 'Analyze' },
    { label: 'Diseases', to: '/diseases' },
    { to: '/#how-it-works', label: 'How It Works' },
    { to: '/#safety', label: 'Safety' },
  ];

  return (
    <footer
      className="mt-auto border-t border-white/5 py-12 px-6 sm:px-10 bg-[#03080B] relative z-10"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoMark id="footer-logo" />
            <span
              style={{
                fontFamily: 'var(--pg-font-brand)',
                fontSize: '18px',
                color: 'var(--pg-teal)',
                fontWeight: 600,
              }}
            >
              PlantGuard AI
            </span>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {links.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-white/50 hover:text-[#88DECC] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-white/30 font-mono">
            © {new Date().getFullYear()} PlantGuard AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
