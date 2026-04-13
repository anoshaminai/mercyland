import Home from '../components/Home';
import { songs } from '../data/media';

const ListenPage = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-pink pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          {songs.map((song) => (
            <div key={song.id} className="grid grid-cols-1 gap-8 items-center justify-items-center">
              <h2 className="text-4xl text-mercy-black font-primary text-center">{song.title}</h2>
              {song.albumArt && (
                <img
                  src={song.albumArt}
                  alt={`${song.title} album cover`}
                  className="w-150 h-150 object-cover"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {song.spotifyEmbed && (
                  <div className="flex gap-8 justify-center items-center">
                    <iframe
                      src={song.spotifyEmbed}
                      width="350px"
                      height="352"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                )}
                {song.soundcloudEmbed && (
                  <div className="flex gap-8 justify-center items-center">
                    <iframe
                      width="350px"
                      height="350"
                      allow="autoplay"
                      src={song.soundcloudEmbed}
                    />
                  </div>
                )}
                {song.bandcampEmbed && (
                  <div className="flex gap-8 justify-center items-center">
                    <iframe
                      style={{ border: 0, width: '350px', height: '350px' }}
                      src={song.bandcampEmbed}
                      seamless
                    >
                      <a href={`https://thankgodformercyland.bandcamp.com/track/${song.id}`}>
                        {song.title} by Mercy Land
                      </a>
                    </iframe>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ListenPage;
