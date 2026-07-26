// Mercy Land — House World: summertimeBTS content (overlay · summertime "spy on the party")
// A simple image gallery. Images are band-authored data (content-registry.tsx) — accepts an
// optional `images` prop, falls back to the registry constant. Empty → a graceful placeholder,
// so the overlay is wired and testable before the photos exist.

import { useState } from 'react';
import { summertimeBTSImages } from '../../../data/content-registry';

export function SummertimeBTS(props: Record<string, unknown>) {
  const images = Array.isArray(props.images) ? (props.images as string[]) : summertimeBTSImages;
  const [i, setI] = useState(0);

  const heading = (
    <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.5rem', margin: '0 0 14px' }}>
      behind the party
    </h2>
  );

  if (images.length === 0) {
    return (
      <div>
        {heading}
        <div className="gallery__stage">
          <div className="embed-media__load" aria-hidden="true">
            <span className="embed-media__play">◵</span>
            <span>coming soon</span>
          </div>
        </div>
      </div>
    );
  }

  const clamped = Math.min(i, images.length - 1);
  return (
    <div>
      {heading}
      <div className="gallery__stage">
        <img src={images[clamped]} alt={`behind the scenes ${clamped + 1} of ${images.length}`} />
      </div>
      {images.length > 1 ? (
        <div className="gallery__controls">
          <button
            type="button"
            className="gallery__nav"
            aria-label="previous photo"
            disabled={clamped === 0}
            onClick={() => setI((n) => Math.max(0, n - 1))}
          >
            ‹
          </button>
          <span className="gallery__count">
            {clamped + 1} / {images.length}
          </span>
          <button
            type="button"
            className="gallery__nav"
            aria-label="next photo"
            disabled={clamped === images.length - 1}
            onClick={() => setI((n) => Math.min(images.length - 1, n + 1))}
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
