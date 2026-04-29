import { useNavigate } from 'react-router-dom';

export const ExplorePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-mercy-black flex items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-8 max-w-[640px] w-full">
        <h1 className="text-mercy-pink font-secondary text-4xl md:text-5xl text-center">
          explore
        </h1>
        <p className="text-mercy-white font-primary text-sm md:text-base text-center opacity-80 leading-relaxed">
          something fun goes here.
        </p>
        <button
          onClick={() => navigate('/chat-world')}
          className="text-mercy-white/60 font-primary text-xs hover:text-mercy-white transition-colors cursor-pointer"
        >
          ← back to chat world
        </button>
      </div>
    </div>
  );
};
