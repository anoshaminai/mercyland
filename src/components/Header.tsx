import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4">
      <div className="flex gap-8">
        <NavLink to="/" className="text-[#FF0000]">INFO</NavLink>
        <NavLink to="/listen" className="text-[#FF0000]">LISTEN</NavLink>
        <NavLink to="/watch" className="text-[#FF0000]">WATCH 'TERMITES'</NavLink>
        {/* <NavLink to="/shows" className="text-[#FF0000]">SHOWS</NavLink>
        <NavLink to="/shop" className="text-[#FF0000]">SHOP</NavLink> */}
      </div>
      <div>
        <span className="text-[#FF0000]">VOID: <span className="text-white">ON</span> OFF</span>
      </div>
    </nav>
  );
};

export default Header; 