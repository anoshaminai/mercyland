import Home from '../components/Home';
import EmailSignup from '../components/EmailSignup';
import { songs } from '../data/media';
import { videos } from '../data/videos';
import touchingImage from '../assets/images/touching.jpg';
import '../styles/FlatPage.css';

export const FlatPage = () => {
  return (
    <>
      <Home />
      <nav className="flat-nav">
        <a href="#music">MUSIC</a>
        <a href="#videos">VIDEOS</a>
        <a href="#about">ABOUT</a>
        <a href="#signup">SIGNUP</a>
      </nav>

      <section id="music" className="min-h-screen bg-mercy-pink pt-8 pb-16">
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

      <section id="videos" className="min-h-screen bg-mercy-olive pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 items-center justify-items-center mb-12">
            <h1 className="text-5xl text-mercy-green font-secondary text-center">
              Termites: A Love Story
            </h1>
            <h2 className="text-2xl text-mercy-green font-primary text-center">
              by Mercy Land
            </h2>
            <p className="max-w-md text-left font-primary">
              An isolated girl spends her days inside a strange and enchanting room. When a stranger appears through her computer screen, he takes her on a journey through discovery, darkness, and truth.
            </p>
          </div>

          {videos.map((video) => (
            <div key={video.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-items-center mb-12">
              <div className="w-full max-w-[400px] aspect-[9/16]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?&theme=dark&autohide=2`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex flex-col gap-4 items-center">
                {video.episode && (
                  <h3 className="text-2xl text-mercy-white font-primary text-center">
                    {video.episode}:
                  </h3>
                )}
                <h2 className="text-5xl text-mercy-green font-secondary text-center">
                  {video.title}
                </h2>
                <p className="max-w-md text-left font-primary">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="min-h-screen bg-mercy-red pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            <div className="space-y-4">
              <p className="text-mercy-black font-primary">
                Thank God for Mercy Land
              </p>
            </div>
            <img
              src={touchingImage}
              alt="Band photo"
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
      </section>

      <section id="signup" className="bg-mercy-blue pt-16 pb-16">
        <div className="max-w-content mx-auto px-4 flex flex-col items-center gap-8">
          <h2 className="text-4xl text-mercy-green font-secondary text-center">
            Join the Void
          </h2>
          <EmailSignup />
        </div>
      </section>
    </>
  );
};
