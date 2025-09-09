import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Header.css';

const Header: React.FC = () => {
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
          {/* <NavLink to="/shows">SHOWS</NavLink>
          <NavLink to="/shop">SHOP</NavLink> */}
        </nav>
      </div>
    </header>
  );
};

export default Header; 