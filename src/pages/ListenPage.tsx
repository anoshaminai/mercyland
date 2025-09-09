import React from 'react';
import Home from '../components/common/Home';
import kidA from '../assets/images/Kid A cover art.jpg';
import getLost from '../assets/images/Get Lost cover art.jpg';
import wtlgo from '../assets/images/wtlgo cover art.jpg';
import rt42 from '../assets/images/Rt42 cover art.jpg';
import Container from '../components/layout/Container';
import Section from '../components/layout/Section';
import ContentColumn from '../components/ui/ContentColumn';


const ListenPage: React.FC = () => {
  return (
    <>
      <Home />
      <Section background="bg-mercy-pink">
        
        <Container className="gap-8">

          {/* Kid A section */}
          <ContentColumn className="items-center">
            <h2 className="text-4xl text-mercy-black font-primary text-center">Kid A</h2>
            <img 
              src={kidA}
              alt="Kid A album cover" 
              className="w-150 h-150 object-cover"
            />
          </ContentColumn>

            <ContentColumn>
              <iframe 
                style={{ border: 0, width: '350px', height: '350px' }}
                src="https://bandcamp.com/EmbeddedPlayer/track=1301656413/size=large/bgcol=333333/linkcol=0f91ff/minimal=true/transparent=true/" 
                seamless
              >
                <a href="https://thankgodformercyland.bandcamp.com/track/kid-a">Kid A by Mercy Land</a>
              </iframe>
            </ContentColumn>


                    {/* Get Lost section */}
          <ContentColumn className="items-center">
            <h2 className="text-4xl text-mercy-black font-primary text-center">Get Lost!</h2>
            <img 
              src={getLost}
              alt="Get Lost! album cover" 
              className="w-150 h-150 object-cover"
            />
          </ContentColumn>
         
            
            <ContentColumn>
              <iframe 
                style={{ border: 0, width: '350px', height: '350px' }}
                src="https://bandcamp.com/EmbeddedPlayer/track=2691189257/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" 
                seamless
              >
                <a href="https://thankgodformercyland.bandcamp.com/track/get-lost">Get Lost! by Mercy Land</a>
              </iframe>
            </ContentColumn>

            {/* WTLGO section */}
          <ContentColumn className="items-center">
            <h2 className="text-4xl text-mercy-black font-primary text-center">When the Lights</h2>
            <img 
              src={wtlgo}
              alt="When the lights album cover" 
              className="w-150 h-150 object-cover"
            />
          </ContentColumn>
         

            <ContentColumn>
              <iframe 
                style={{ border: 0, width: '350px', height: '350px' }}
                src="https://bandcamp.com/EmbeddedPlayer/track=2373043130/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" 
                seamless
              >
                <a href="https://thankgodformercyland.bandcamp.com/track/when-the-lights">When the Lights by Mercy Land</a>
              </iframe>
            </ContentColumn>

          {/* Rt42 section */}
          <ContentColumn className="items-center">
            <h2 className="text-4xl text-mercy-black font-primary text-center">Route 42</h2>
            <img 
              src={rt42}
              alt="Rt 42 album cover" 
              className="w-150 h-150 object-cover"
            />
          </ContentColumn>
         
            
            <ContentColumn>
              <iframe 
                style={{ border: 0, width: '350px', height: '350px' }}
                src="https://bandcamp.com/EmbeddedPlayer/track=2373043130/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" 
                seamless
              >
                <a href="https://thankgodformercyland.bandcamp.com/track/kid-a">Kid A by Mercy Land</a>
              </iframe>
            </ContentColumn>
        </Container>
        
      </Section>
    </>
  );
};

export default ListenPage; 