'use client';

import { useRef } from 'react';
import LangToggle from './LangToggle';

const ST = ({ children }) => (
  <span className="st-wrap">
    <span className="st">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  </span>
);

/**
 * Shared site header.
 *
 * backHref   – if set, logo becomes a link there and a ← button is added
 * menuOpen   – mobile overlay state
 * onMenuToggle
 * playFx
 * navRef     – forwarded to <nav> for the radius-morph hover effect
 * navItems   – [{ label, pill?, href?, onClick? }]
 * hintReset  – shows "reset" instead of hintLabel
 * onHint     – if provided, renders the hint button; if null, button is hidden
 * hintLabel  – defaults to "Press / for?"
 */
export default function SiteHeader({
  backHref     = null,
  menuOpen     = false,
  onMenuToggle,
  playFx       = () => {},
  navRef,
  navItems     = [],
  hintReset    = false,
  onHint       = null,
  hintLabel    = 'Press / for?',
}) {
  const internalNavRef = useRef(null);
  const ref = navRef ?? internalNavRef;

  const handleNavEnter = () => ref.current?.classList.add('nav--active');
  const handleNavLeave = () => ref.current?.classList.remove('nav--active');

  return (
    <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>

      {/*
        Logo area:
        • main page  → LangToggle (replaces the arsendsgn scroll-to-top button)
        • case page  → <div class="header-logo-group"> with back arrow + LangToggle
      */}
      {backHref ? (
        <div className="header-logo-group">
          <a href={backHref} className="header-back" onMouseEnter={playFx} aria-label="Back">
            ←
          </a>
          <LangToggle playFx={playFx} />
        </div>
      ) : (
        <LangToggle playFx={playFx} />
      )}

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

      {/* Right — hint + mobile menu toggle */}
      <div className="header-right">
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
