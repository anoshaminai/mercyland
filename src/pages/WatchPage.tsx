import Home from '../components/Home';
import { videos } from '../data/videos';

const WatchPage = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-pink pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          {videos.map((video) => (
            <div key={video.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-items-center">
              <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-4 justify-center items-center">
                  <h1 className="text-5xl text-mercy-green font-secondary text-center">{video.title}</h1>
                  <h2 className="text-2xl text-mercy-green font-primary text-center">by Mercy Land</h2>
                </div>
                <div className="flex justify-center items-center">
                  <p className="max-w-md text-left">{video.description}</p>
                </div>
              </div>
              <div className="w-full max-w-[400px] aspect-[9/16]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?&theme=dark&autoplay=1&autohide=2`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WatchPage;
