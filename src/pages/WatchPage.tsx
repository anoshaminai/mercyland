import React, { useEffect } from 'react';
import Logo from '../components/Logo';

const WatchPage: React.FC = () => {
  console.log('WatchPage rendering');

  useEffect(() => {
    console.log('WatchPage mounted');
    return () => {
      console.log('WatchPage unmounted');
    };
  }, []);

  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl text-[#4A7F3F] mb-8">Watch 'Termites'</h1>
      <Logo />
      <p className="text-white">Coming soon...</p>
    </div>
  );
};

export default WatchPage; 