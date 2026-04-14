import { NavLink } from 'react-router-dom';
import { ViewToggle } from './ViewToggle';
import '../styles/VoidNav.css';

export const VoidNav = () => {
  return (
    <nav className="void-nav">
      <NavLink to="/info" className={({ isActive }) => isActive ? 'active' : ''}>
        INFO
      </NavLink>
      <NavLink to="/listen" className={({ isActive }) => isActive ? 'active' : ''}>
        LISTEN
      </NavLink>
      <NavLink to="/watch" className={({ isActive }) => isActive ? 'active' : ''}>
        WATCH
      </NavLink>
      <ViewToggle />
    </nav>
  );
};
