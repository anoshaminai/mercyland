import React from 'react';
import logo from '../../assets/images/temp_logo.png';
//TODO: replace with high quality logo
const Logo: React.FC = () => {
  return (
    <div className="w-full md:w-2/3 mx-auto">
      <img src={logo} alt="Mercy Land Logo" className="w-full h-auto" />
    </div>
  );
};

export default Logo; 