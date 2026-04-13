import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="max-w-content mx-auto">
        <nav className="navigation">
          <NavLink
            to="/"
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
        </nav>
      </div>
    </header>
  );
};

export default Header; 