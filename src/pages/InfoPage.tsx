import React from 'react';
import Home from '../components/common/Home';
import touchingImage from '../assets/images/touching.jpg';

const InfoPage: React.FC = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-red pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            <div className="space-y-4">
              {/* <h2 className="text-4xl text-mercy-green font-primary text-center">About Us</h2> */}
              <p className="text-mercy-black font-primary">
                Thank God for Mercy Land
              </p>
            </div>
            <img 
              src={touchingImage}
              alt="Band photo 1" 
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoPage; 