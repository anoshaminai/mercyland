import bayou from '../../assets/images/swamp-placeholder.png';

export const BayouHero = () => (
  <section className="relative w-full h-screen overflow-hidden">
    <img
      src={bayou}
      alt="Bayou landscape"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <h1 className="font-display text-mercy-red text-[18vw] leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        Mercy Land
      </h1>
    </div>
  </section>
);
