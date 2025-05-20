import React from 'react';
import Home from '../components/Home';
import kidA from '../assets/images/Kid A cover art.jpg';

const WatchPage: React.FC = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-pink pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 items-center justify-items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
              <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="text-5xl text-mercy-green font-secondary text-center">Termites: A Love Story</h1> 
                <h2 className="text-2xl text-mercy-green font-primary text-center">by Mercy Land</h2> 
              </div>
              <div className="flex gap-8 justify-center items-center">
                <p className="max-w-md text-left">
                  An isolated girl spends her days inside a strange and enchanting room. When a stranger appears through her computer screen, he takes her on a journey through discovery, darkness, and truth.
                </p>
              </div>
            </div>
            <div className="w-full max-w-[400px] aspect-[9/16]">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/u-QkMqxZWs0?&theme=dark&autoplay=1&autohide=2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WatchPage; 