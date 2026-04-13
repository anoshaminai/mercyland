import Home from '../components/Home';
import touchingImage from '../assets/images/touching.jpg';

const InfoPage = () => {
  return (
    <>
      <Home />
      <section className="min-h-screen bg-mercy-red pt-8 pb-16">
        <div className="max-w-content mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            <div className="space-y-4">
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