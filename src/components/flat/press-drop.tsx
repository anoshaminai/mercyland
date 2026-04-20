import pressCover from '../../assets/images/band/stairs vertical 1.jpg';
import { PRESS_ARTICLE_URL } from '../../data/links';
import { FlatSection } from './flat-section';

export const PressDrop = () => (
  <FlatSection>
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <p className="text-mercy-white font-primary text-base leading-relaxed">
        || control || remix & visualizer
      </p>
      <a
        href={PRESS_ARTICLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <img
          src={pressCover}
          alt="press cover"
          loading="lazy"
          decoding="async"
          className="w-full aspect-[3/4] object-cover"
        />
      </a>
    </div>
  </FlatSection>
);
