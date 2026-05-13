import { Link } from 'react-router-dom';
import { ViewToggle } from './ViewToggle';
import { MERCH_URL } from '../data/links';
import '../styles/Header.css';

const scrollToId = (id: string) => () => {
  document.getElementById(id)?.scrollIntoView();
};

const Header = () => {
  return (
    <header className="header">
      <div className="max-w-content mx-auto">
        <nav className="navigation">
          <Link to="/flat#la-overlay" onClick={scrollToId('la-overlay')}>INFO</Link>
          <Link to="/flat#termites" onClick={scrollToId('termites')}>LISTEN</Link>
          <Link to="/flat#termites" onClick={scrollToId('termites')}>WATCH</Link>
          <a href={MERCH_URL} target="_blank" rel="noopener noreferrer">MERCH</a>
          <span className="nav-divider">|</span>
          <ViewToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
