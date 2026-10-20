/**
 * Header — Shared across all routes.
 * Uses spec-exact classes (.pg-header, .pg-menu-btn) and layout.
 * On inner pages, provides a sticky translucent bar; on home hero, sits within stage.
 */
import { LogoMark } from '../hero/LogoMark';
import { NavPill } from '../hero/NavPill';
import { SoundButton } from '../hero/SoundButton';
import { MenuBarsIcon } from '../hero/icons';
import { MobileMenu } from './MobileMenu';
import { ApiStatus } from './ApiStatus';
import { useMobileMenu } from '../../hooks/useMobileMenu';

export function Header({ isHeroHeader = false, isHidden = false }) {
  const { isOpen, toggle, close, buttonRef, panelRef } = useMobileMenu();

  return (
    <>
      <header
        className={`pg-header ${isHeroHeader ? '' : 'pg-header--inner'}`}
        role="banner"
      >
        {/* Top left Logo Pill */}
        <LogoMark isHidden={isHidden} />

        {/* Center Nav Pill */}
        <NavPill isHidden={isHidden} />

        {/* Right Cluster: Mobile Menu button + Sound button + API Status */}
        <div className="pg-header__right" style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--u) * 10)' }}>
          {/* Mobile menu button [SPEC: 3-bar → X, 48px black circle] */}
          <button
            ref={buttonRef}
            className={`pg-menu-btn ${isHidden ? 'pg-entrance-hidden' : ''}`}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="pg-mobile-nav"
            id="pg-menu-btn"
            type="button"
            onClick={toggle}
          >
            <MenuBarsIcon isOpen={isOpen} />
          </button>

          {/* Sound button */}
          <SoundButton isHidden={isHidden} />

          {/* API Status (React version only; subtle) */}
          <div className="pg-api-status-wrapper">
            <ApiStatus />
          </div>
        </div>
      </header>

      {/* Mobile nav panel */}
      <MobileMenu isOpen={isOpen} onClose={close} panelRef={panelRef} />
    </>
  );
}
