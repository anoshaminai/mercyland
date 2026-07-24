// Mercy Land — shared Header (spec: nav_header.md; v2-site.md §3)
// ONE header, identical on every route, mounted app-level (see App.tsx Layout) as the
// out-of-world utility layer. The wordmark returns to the world root (`/`) — on non-scene
// routes (/void, /chat, /flat) it is the sole guaranteed way back. Structure + behavior are
// locked here; the immersive skin is all §Design-token fill (Header.css reads the tokens).

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MERCH_URL } from '../data/links';
import '../styles/Header.css';

type NavItem =
  | { label: string; kind: 'internal'; route: string }
  | { label: string; kind: 'external'; url: string };

// Locked structure; some targets are still open decisions (nav_header.md §Open decisions).
const navItems: NavItem[] = [
  // Explicit return into the House World. Interim: the wordmark is spec'd as the return-to-world,
  // but the world root `/` still renders the old landing — until `/` becomes the House World,
  // this tab is the reliable way in. Remove it once the wordmark covers it.
  { label: 'world', kind: 'internal', route: '/world' },
  { label: 'info', kind: 'internal', route: '/flat' },
  // TODO(nav_header.md #1): dedicated /listen page or a single external streaming link.
  // For now it points at the flat view's listen section (no /listen route exists yet).
  { label: 'listen', kind: 'internal', route: '/flat#termites' },
  { label: 'merch', kind: 'external', url: MERCH_URL },
];

const routePath = (route: string) => route.split('#')[0];

const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  const renderItem = (item: NavItem) => {
    if (item.kind === 'external') {
      return (
        <a
          key={item.label}
          className="header__item"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          {item.label}
        </a>
      );
    }
    const active = routePath(item.route) === pathname;
    return (
      <Link
        key={item.label}
        className={`header__item${active ? ' header__item--active' : ''}`}
        to={item.route}
        aria-current={active ? 'page' : undefined}
        onClick={close}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="header">
      <Link className="header__wordmark" to="/" onClick={close} aria-label="Mercy Land — return to the world">
        Mercy Land
      </Link>

      {/* Desktop: inline items. Mobile: collapsed behind the toggle below. */}
      <nav className="header__items" aria-label="site">
        {navItems.map(renderItem)}
      </nav>

      {/* Mobile toggle — collapses the header to a single control (v2-site.md §3). */}
      <button
        type="button"
        className="header__toggle"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'close menu' : 'open menu'}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen ? (
        <nav className="header__menu" aria-label="site">
          {navItems.map(renderItem)}
        </nav>
      ) : null}
    </header>
  );
};

export default Header;
