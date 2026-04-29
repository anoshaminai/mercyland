import { TERMITES_EP_URL, TERMITES_FILM_URL } from '../../data/links';
import { termitesCovers } from '../../data/termites';
import { FlatSection } from './flat-section';

const Cover = ({ src, title }: { src: string; title: string }) => (
  <img
    src={src}
    alt={`${title} cover`}
    loading="lazy"
    decoding="async"
    className="w-full aspect-square object-cover"
  />
);

export const TermitesSection = () => (
  <FlatSection id="termites" bg="bg-termites-bg" className="py-32">
    <div className="max-w-6xl mx-auto flex flex-col gap-6 md:grid md:grid-cols-2 md:grid-rows-3 md:gap-6">
      <Cover {...termitesCovers.termites} />

      <div className="relative md:aspect-square flex flex-col justify-between p-4 md:p-6">
        <h2 className="font-display text-mercy-red text-[14vw] md:text-[8vw] leading-none">
          Termites
        </h2>

        <span
          aria-hidden
          className="self-center font-display text-mercy-white/10 text-[22vw] md:text-[13vw] leading-none select-none pointer-events-none"
        >
          2025
        </span>

        <p className="text-mercy-white/80 font-primary text-xs md:text-sm leading-relaxed">
          Laura Jinn spends her days tending to the Void, until one day, the Void gives her something new.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <a
            href={TERMITES_EP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-mercy-red text-mercy-red font-primary text-xs md:text-sm tracking-widest px-3 py-2 text-center hover:bg-mercy-red hover:text-mercy-black transition-colors"
          >
            LISTEN TO THE EP
          </a>
          <a
            href={TERMITES_FILM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-mercy-green text-mercy-green font-primary text-xs md:text-sm tracking-widest px-3 py-2 text-center hover:bg-mercy-green hover:text-mercy-black transition-colors"
          >
            WATCH THE FILM
          </a>
        </div>
      </div>

      <Cover {...termitesCovers.kidA} />
      <Cover {...termitesCovers.rt42} />
      <Cover {...termitesCovers.getLost} />
      <Cover {...termitesCovers.wtlgo} />
    </div>
  </FlatSection>
);
