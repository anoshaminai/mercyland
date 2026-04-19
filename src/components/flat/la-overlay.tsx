import { FlatSection } from './flat-section';
import { PlaceholderBox } from './placeholder-box';

export const LaOverlay = () => (
  <FlatSection>
    <div className="relative max-w-5xl mx-auto">
      <PlaceholderBox label="couple image" aspect="16 / 9" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
        <p className="font-display text-mercy-red text-[6vw] leading-tight text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          {/* TODO: replace with the real overlay line */}
          Currently based in Los Angeles
        </p>
      </div>
    </div>
  </FlatSection>
);
