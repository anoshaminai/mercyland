import React from 'react';
import Logo from './Logo';
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
          <div className="mt-4">
            <iframe 
              id="laylo-drop-fd1Vn"
              frameBorder="0"
              scrolling="no"
              allow="web-share"
              allowTransparency={true}
              style={{
                width: '1px',
                minWidth: '100%',
                maxWidth: '1000px'
              }}
              src="https://embed.laylo.com?dropId=fd1Vn&color=FF2F00&minimal=false&theme=light"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 