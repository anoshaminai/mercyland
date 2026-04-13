import Home from '../components/Home';
import { songs } from '../data/media';

const ListenPage = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-pink pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          {songs.map((song) => (
            <div key={song.id} className="grid grid-cols-1 gap-8 items-center justify-items-center mb-16">
              <h2 className="text-4xl text-mercy-black font-primary text-center">{song.title}</h2>
              {song.albumArt && (
                <img
                  src={song.albumArt}
                  alt={`${song.title} album cover`}
                  className="w-150 h-150 object-cover"
                />
              )}
              {song.bandcampEmbed && (
                <iframe
                  style={{ border: 0, width: '350px', height: '350px' }}
                  src={song.bandcampEmbed}
                  seamless
                >
                  <a href={`https://thankgodformercyland.bandcamp.com/track/${song.id}`}>
                    {song.title} by Mercy Land
                  </a>
                </iframe>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ListenPage;
