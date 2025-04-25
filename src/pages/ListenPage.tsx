import React, { useEffect } from 'react';

const ListenPage: React.FC = () => {
  console.log('ListenPage rendering');

  useEffect(() => {
    console.log('ListenPage mounted');
    return () => {
      console.log('ListenPage unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-[#4A7F3F] mb-8">Listen</h1>
      <p className="text-white">Coming soon...</p>
    </div>
  );
};

export default ListenPage; 