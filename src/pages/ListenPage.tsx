import React, { useEffect } from 'react';
import Logo from '../components/Logo';

const ListenPage: React.FC = () => {
  console.log('ListenPage rendering');

  useEffect(() => {
    console.log('ListenPage mounted');
    return () => {
      console.log('ListenPage unmounted');
    };
  }, []);

  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl text-[#4A7F3F] mb-8">Listen</h1>
      <Logo />
      <p className="text-white">Coming soon...</p>
    </div>
  );
};

export default ListenPage; 