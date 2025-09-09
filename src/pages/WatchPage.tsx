import React from 'react';
import Home from '../components/common/Home';
import Section from '../components/layout/Section';
import ContentColumn from '../components/ui/ContentColumn';
import Container from '../components/layout/Container';
import GridRow from '../components/ui/GridRow';
import { VideoEmbed } from '../components/ui/VideoEmbed';

const WatchPage: React.FC = () => {
  return (
    <>
      <Home />
      <Section>
       <Container>
        <GridRow>
          <ContentColumn className="items-center">
            <h1 className="text-5xl text-mercy-green font-secondary text-center">
              Termites: A Love Story
            </h1>
            <h2 className="text-2xl text-mercy-green font-primary text-center">
              by Mercy Land
            </h2>
          </ContentColumn>
          <ContentColumn>
            <p className="max-w-md text-left font-primary">
              An isolated girl spends her days inside a strange and enchanting room. When a stranger appears through her computer screen, he takes her on a journey through discovery, darkness, and truth.
            </p>
          </ContentColumn>
        </GridRow>
        
        <GridRow>
          <VideoEmbed src="https://www.youtube.com/embed/u-QkMqxZWs0?&theme=dark&autoplay=1&autohide=2" />
          <ContentColumn>
            <h3 className="text-2xl text-mercy-white font-primary text-center">
              EPISODE 1:
            </h3>
            <h2 className="text-5xl text-mercy-green font-secondary text-center">
              Kid A
            </h2>
          </ContentColumn>
        </GridRow>

          <GridRow>
          <VideoEmbed src="https://www.youtube.com/embed/3iTGqtmzLiI?si=a83SJbZjf0NavefF" />
          <ContentColumn>
            <h3 className="text-2xl text-mercy-white font-primary text-center">
              EPISODE 2:
            </h3>
            <h2 className="text-5xl text-mercy-green font-secondary text-center">
              Get Lost!
            </h2>
          </ContentColumn>
        </GridRow>
      </Container>
    </Section>
    </>
  );
};

export default WatchPage; 