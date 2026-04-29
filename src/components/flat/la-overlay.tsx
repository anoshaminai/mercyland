import mallGoth from '../../assets/images/environments/mall goth.png';

export const LaOverlay = () => (
  <div id="la-overlay" className="relative h-0 z-10 pointer-events-none">
    <div className="absolute inset-x-0 -translate-y-1/2 flex items-center justify-center px-6">
      <img
        src={mallGoth}
        alt="mall goth alt rock from New Orleans"
        loading="lazy"
        decoding="async"
        className="max-w-[80vw] h-auto drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
      />
    </div>
  </div>
);
