import portrait from '../../assets/images/band/parking lot touching.jpg';
import { FlatSection } from './flat-section';

const portraitBorderStyle = {
  boxShadow:
    '0 0 0 3px var(--color-mercy-red), 6px 6px 0 3px var(--color-mercy-red), 6px 6px 0 5px var(--color-mercy-pink)',
};

export const InfluencesBlock = () => (
  <FlatSection bg="bg-influences-bg">
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="p-6">
        <img
          src={portrait}
          alt="Mercy Land duo portrait"
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover"
          style={portraitBorderStyle}
        />
      </div>
      <p className="text-influences-text font-primary text-base leading-relaxed">
        {/* TODO: replace with the real influences paragraph */}
        Influenced by gospel choirs, drum machines, late-night radio sermons, and the kind of
        country music your grandmother warned you about. The duo writes the way other people pray.
      </p>
    </div>
  </FlatSection>
);
