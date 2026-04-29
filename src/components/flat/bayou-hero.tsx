import header from '../../assets/images/environments/header_bedroom.jpg';

export const BayouHero = () => (
  <section className="relative w-full h-[calc(100vh-var(--header-h))] overflow-hidden">
    <img
      src={header}
      alt="Mercy Land"
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className="absolute inset-0 w-full h-full object-cover object-top"
    />
  </section>
);
