import { TERMITES_EP_URL, TERMITES_FILM_URL } from '../../data/links';
import { termitesCovers } from '../../data/termites';
import { FlatSection } from './flat-section';
import { PlaceholderBox } from './placeholder-box';

export const TermitesSection = () => (
  <FlatSection className="py-32">
    <div className="max-w-5xl mx-auto">
      <div className="relative flex items-center justify-center mb-16">
        <span
          aria-hidden
          className="absolute font-display text-mercy-white/10 text-[20vw] leading-none select-none"
        >
          2026
        </span>
        <h2 className="relative font-display text-mercy-red text-[14vw] leading-none">
          Termites
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
        <a
          id="listen"
          href={TERMITES_EP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-mercy-red text-mercy-red font-primary text-lg tracking-widest px-8 py-4 text-center hover:bg-mercy-red hover:text-mercy-black transition-colors"
        >
          LISTEN TO THE EP
        </a>
        <a
          id="watch"
          href={TERMITES_FILM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-mercy-green text-mercy-green font-primary text-lg tracking-widest px-8 py-4 text-center hover:bg-mercy-green hover:text-mercy-black transition-colors"
        >
          WATCH THE FILM
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {termitesCovers.map((cover, i) =>
          cover.src ? (
            <img
              key={i}
              src={cover.src}
              alt={`${cover.title} cover`}
              loading="lazy"
              decoding="async"
              className="w-full aspect-square object-cover"
            />
          ) : (
            <PlaceholderBox key={i} label={cover.title} aspect="1 / 1" />
          )
        )}
      </div>
    </div>
  </FlatSection>
);
