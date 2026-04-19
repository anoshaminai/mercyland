import letter from '../../assets/images/swamp-placeholder.png';
import { FlatSection } from './flat-section';

export const LetterSection = () => (
  <FlatSection>
    <img
      src={letter}
      alt="Handwritten letter to L.J."
      loading="lazy"
      decoding="async"
      className="max-w-xl mx-auto w-full h-auto object-contain"
    />
  </FlatSection>
);
