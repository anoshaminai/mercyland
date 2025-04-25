import React, { useEffect } from 'react';

const WatchPage: React.FC = () => {
  console.log('WatchPage rendering');

  useEffect(() => {
    console.log('WatchPage mounted');
    return () => {
      console.log('WatchPage unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-[#4A7F3F] mb-8">Watch 'Termites'</h1>
      <p className="text-white">Coming soon...</p>
    </div>
  );
};

export default WatchPage; 