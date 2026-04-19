import { Link } from 'react-router-dom';
import { ViewToggle } from './ViewToggle';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="max-w-content mx-auto">
        <nav className="navigation">
          <Link to="/flat#top">INFO</Link>
          <Link to="/flat#listen">LISTEN</Link>
          <Link to="/flat#watch">WATCH 'TERMITES'</Link>
          <span className="nav-divider">|</span>
          <ViewToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
