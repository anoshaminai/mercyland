import { NavLink } from 'react-router-dom';
import { ViewToggle } from './ViewToggle';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="max-w-content mx-auto">
        <nav className="navigation">
          <NavLink
            to="/info"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            INFO
          </NavLink>
          <NavLink
            to="/listen"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            LISTEN
          </NavLink>
          <NavLink
            to="/watch"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            WATCH 'TERMITES'
          </NavLink>
          <span className="nav-divider">|</span>
          <ViewToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header; 