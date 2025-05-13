import React from 'react';
import Logo from '../components/Logo';
import EmailSignup from '../components/EmailSignup';

const InfoPage: React.FC = () => {
  return (
    <main className="relative h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <Logo />
        <EmailSignup />
      </div>
    </main>
  );
};

export default InfoPage; 