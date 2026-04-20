import { useVideoReady } from '../../lib/video-ready-store';

export const LoadingOverlay = () => {
  const ready = useVideoReady();

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-[1800ms] ease-out ${
        ready ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="font-display text-mercy-white/70 text-4xl tracking-wider">
        entering the void…
      </span>
    </div>
  );
};
