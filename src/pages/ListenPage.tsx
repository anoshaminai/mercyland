import React from 'react';
import Home from '../components/Home';
import kidA from '../assets/images/Kid A cover art.jpg';

const ListenPage: React.FC = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-pink pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 items-center justify-items-center">
          <h2 className="text-4xl text-mercy-green font-primary text-center">Kid A</h2> 
            <img 
              src={kidA}
              alt="Kid A album cover" 
              className="w-198 h-198 object-cover items-center"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="flex gap-8 justify-center items-center">
                <iframe 
                  src="https://open.spotify.com/embed/album/2VHtTgQDgzi3z4MewLHfSP?utm_source=generator" 
                  width="350px" 
                  height="352" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                />
              </div>
              <div className="flex gap-8 justify-center items-center">
                <iframe 
                  width="350px" 
                  height="350"  
                  allow="autoplay"
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2080693716&color=%23902722&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                />
              </div>
              <div className="flex gap-8 justify-center items-center">
                <iframe 
                  style={{ border: 0, width: '350px', height: '350px' }}
                  src="https://bandcamp.com/EmbeddedPlayer/track=1301656413/size=large/bgcol=333333/linkcol=0f91ff/minimal=true/transparent=true/" 
                  seamless
                >
                  <a href="https://thankgodformercyland.bandcamp.com/track/kid-a">Kid A by Mercy Land</a>
                </iframe>
              </div>
              {/* <div className="flex gap-8 justify-center items-center">
                <iframe 
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                  style={{ 
                    width: '350px',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px'
                  }}
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                  src="https://embed.music.apple.com/us/song/kid-a/1805286177"
                />
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListenPage; 