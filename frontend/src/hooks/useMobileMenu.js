/**
 * useMobileMenu — Implements spec-exact mobile menu behavior:
 * - Toggle panel
 * - Escape closes and returns focus to button
 * - Outside click closes
 * - Link click closes
 * - When opened, focuses first link
 */
import { useState, useEffect, useRef } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    // Focus first link on open
    const firstLink = panelRef.current?.querySelector('a');
    firstLink?.focus();

    // Escape closes and returns focus
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    // Outside click closes
    const handleOutsideClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close,
    buttonRef,
    panelRef,
  };
}
