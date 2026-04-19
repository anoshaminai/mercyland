import { PRESS_ARTICLE_URL } from '../../data/links';
import { FlatSection } from './flat-section';
import { PlaceholderBox } from './placeholder-box';

export const PressDrop = () => (
  <FlatSection>
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <p className="text-mercy-white font-primary text-base leading-relaxed">
        {/* TODO: replace with the real press / info drop block */}
        Read about the EP in the latest issue. A short piece on Mercy Land,
        the bayou, and the long drive west.
      </p>
      <a
        href={PRESS_ARTICLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity"
      >
        <PlaceholderBox label="press cover" aspect="3 / 4" />
      </a>
    </div>
  </FlatSection>
);
