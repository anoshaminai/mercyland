// Mercy Land — House World: summertimeBTS content (overlay · summertime "spy on the party")
// A simple image gallery. Photos are band-authored data (content-registry.tsx) — accepts an
// optional `photos` prop, falls back to the registry constant. Empty → a graceful placeholder,
// so the overlay is wired and testable before the photos exist.

import { useState } from 'react';
import { summertimeBTSPhotos } from '../../../data/content-registry';
import type { BtsPhoto } from '../../../lib/bts-assets';

export function SummertimeBTS(props: Record<string, unknown>) {
  const photos = Array.isArray(props.photos) ? (props.photos as BtsPhoto[]) : summertimeBTSPhotos;
  const [i, setI] = useState(0);

  const heading = (
    <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.5rem', margin: '0 0 14px' }}>
      through the window
    </h2>
  );

  if (photos.length === 0) {
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

  const clamped = Math.min(i, photos.length - 1);
  const photo = photos[clamped];

  return (
    <div>
      {heading}
      <figure className="gallery__figure">
        <div className="gallery__stage">
          {/* A caption describes the photo far better than "behind the scenes 3 of 11", so it
              becomes the alt text when one exists. Uncaptioned photos keep the positional
              fallback — never an empty alt, which would hide the image from screen readers. */}
          <img
            src={photo.url}
            alt={photo.caption || `behind the scenes ${clamped + 1} of ${photos.length}`}
          />
        </div>
        {photo.caption ? (
          <figcaption className="gallery__caption">{photo.caption}</figcaption>
        ) : null}
      </figure>
      {photos.length > 1 ? (
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
            {clamped + 1} / {photos.length}
          </span>
          <button
            type="button"
            className="gallery__nav"
            aria-label="next photo"
            disabled={clamped === photos.length - 1}
            onClick={() => setI((n) => Math.min(photos.length - 1, n + 1))}
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
