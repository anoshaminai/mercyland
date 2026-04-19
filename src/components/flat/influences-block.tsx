import portrait from '../../assets/images/touching.jpg';
import { FlatSection } from './flat-section';

export const InfluencesBlock = () => (
  <FlatSection>
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <img
        src={portrait}
        alt="Mercy Land duo portrait"
        loading="lazy"
        decoding="async"
        className="w-full h-auto object-cover"
      />
      <p className="text-mercy-white font-primary text-base leading-relaxed">
        {/* TODO: replace with the real influences paragraph */}
        Influenced by gospel choirs, drum machines, late-night radio sermons, and the kind of
        country music your grandmother warned you about. The duo writes the way other people pray.
      </p>
    </div>
  </FlatSection>
);
