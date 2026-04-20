import letter from '../../assets/images/environments/LJ letter.jpg';

export const LetterSection = () => (
  <section className="w-full bg-mercy-black">
    <img
      src={letter}
      alt="Dear L.J. letter"
      loading="lazy"
      decoding="async"
      className="block w-full h-auto"
    />
  </section>
);
