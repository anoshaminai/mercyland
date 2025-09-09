import React from 'react';
import Home from '../components/common/Home';
import touchingImage from '../assets/images/touching.jpg';
import GridRow from '../components/ui/GridRow';
import Section from '../components/layout/Section';
import ContentColumn from '../components/ui/ContentColumn';

const InfoPage: React.FC = () => {
  return (
    <>
    <Home />
  <Section background="bg-mercy-red">
    <GridRow>
      <ContentColumn className="space-y-4">
        {/* <h2 className="text-4xl text-mercy-green font-primary text-center">About Us</h2> */}
        <p className="text-mercy-black font-primary">
          Thank God for Mercy Land
        </p>
      </ContentColumn>
      <ContentColumn>
        <img 
          src={touchingImage}
          alt="Band photo 1" 
          className="w-full h-screen object-cover"
        />
      </ContentColumn>
    </GridRow>
  </Section>
  </>
  );
};

export default InfoPage; 