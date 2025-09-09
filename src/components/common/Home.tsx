import React from 'react';
import Logo from '../ui/Logo';
import EmailSignup from './EmailSignup';

declare global {
  interface Window {
    LayloSDK: any;
  }
}

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <main className="flex flex-col items-center pt-8 pb-8">
        <div className="max-w-content mx-auto">
          <Logo />
          <EmailSignup />
        </div>
      </main>
    </div>
  );
};

export default Home; 