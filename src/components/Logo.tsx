import React from 'react';
import logo from '../assets/images/temp_logo.png';
const Logo: React.FC = () => {
  return (
    <div>
      <h1 className="text-6xl text-[#4A7F3F] mb-12 justify-center">
        Mercy Land
      </h1>
      <img src={logo} alt="Mercy Land Logo" className="w-full h-auto" />
    </div>
  );
};

export default Logo; 