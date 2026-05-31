'use client';

import { useRef } from 'react';

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

/**
 * Shared site header used on all pages.
 *
 * Props:
 *  backHref     – if set, renders ← back button next to logo linking there
 *  menuOpen     – bool controlling mobile overlay state
 *  onMenuToggle – fn to open/close mobile menu
 *  playFx       – fn to play click sound
 *  navRef       – ref forwarded to <nav> for hover radius morph
 *  navItems     – array of { label, pill?, href?, onClick? }
 *  rightSlot    – optional ReactNode rendered between hint and menu button
 *  hintLabel    – text for the hint button (default "Press / for?")
 *  hintReset    – if true, hint button renders as "reset"
 *  onHint       – fn called when hint button is clicked
 */
export default function SiteHeader({
  backHref    = null,
  menuOpen    = false,
  onMenuToggle,
  playFx      = () => {},
  navRef,
  navItems    = [],
  rightSlot   = null,
  hintLabel   = 'Press / for?',
  hintReset   = false,
  onHint      = null,
}) {
  const internalNavRef = useRef(null);
  const ref = navRef ?? internalNavRef;

  const handleNavEnter = () => ref.current?.classList.add('nav--active');
  const handleNavLeave = () => ref.current?.classList.remove('nav--active');

  return (
    <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>

      {/* Logo + optional back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {backHref ? (
          <a href={backHref} className="logo" onMouseEnter={playFx}>
            <ST>arsendsgn</ST>
          </a>
        ) : (
          <button
            className="logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={playFx}
          >
            <ST>arsendsgn</ST>
          </button>
        )}

        {backHref && (
          <a
            href={backHref}
            className="nav-item square"
            onMouseEnter={playFx}
            aria-label="Back"
            style={{ minWidth: 'unset', padding: '0 1rem' }}
          >
            ←
          </a>
        )}
      </div>

      {/* Nav */}
      <nav
        className="nav"
        ref={ref}
        onMouseEnter={handleNavEnter}
        onMouseLeave={handleNavLeave}
      >
        {navItems.map((item, i) =>
          item.href ? (
            <a
              key={i}
              href={item.href}
              className={`nav-item ${item.pill ? 'pill' : 'square'}`}
              onMouseEnter={playFx}
            >
              <ST>{item.label}</ST>
            </a>
          ) : (
            <button
              key={i}
              className={`nav-item ${item.pill ? 'pill' : 'square'}`}
              onClick={item.onClick}
              onMouseEnter={playFx}
            >
              <ST>{item.label}</ST>
            </button>
          )
        )}
      </nav>

      {/* Right controls */}
      <div className="header-right">
        {rightSlot}

        {onHint && (
          <button
            className={`header-hint${hintReset ? ' header-hint--reset' : ''}`}
            onClick={onHint}
          >
            {hintReset ? 'reset' : hintLabel}
          </button>
        )}

        <button
          className={`menu-btn${menuOpen ? ' menu-btn--open' : ''}`}
          onClick={onMenuToggle}
        >
          <span className="menu-btn-text menu-btn-text--menu">Menu</span>
          <span className="menu-btn-text menu-btn-text--close">Close</span>
        </button>
      </div>
    </header>
  );
}
