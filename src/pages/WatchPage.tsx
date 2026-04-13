import Home from '../components/Home';
import { videos } from '../data/videos';

const WatchPage = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-olive pt-8 pb-16">
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
    </>
  );
};

export default WatchPage;
