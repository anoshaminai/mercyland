import React from 'react';
import Logo from './Logo';
import EmailSignup from './EmailSignup';

interface LayoutProps {
  children?: React.ReactNode;
}

const Home: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center pt-8">
        <div className="max-w-content mx-auto">
          <Logo />
          <EmailSignup />
          {children}
        </div>
      </main>
    </div>
  );
};

export default Home; 