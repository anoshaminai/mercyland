// Mercy Land — House World: EmbeddedVideo (spec v4 §4 embedded-media contract)
// A single YouTube embed that obeys the contract wherever it's hosted:
//   • lazy-mount (#2) + embed budget (#7): the iframe is NOT created until the user clicks the
//     placeholder. Nothing plays, nothing is fetched, until asked.
//   • aspect ratio reserved before load (#3) via the .embed-media container.
//   • unmount on close (#1) is handled by the host (OverlayShell renders only while open).
//   • privacy (#6): youtube-nocookie.
// The play state is content-level, so it lives here — the shell doesn't know about it.

import { useState } from 'react';

export interface EmbeddedVideoProps {
  youtubeId: string;
  title: string;
}

export function EmbeddedVideo({ youtubeId, title }: EmbeddedVideoProps) {
  const [loaded, setLoaded] = useState(false);

  if (!youtubeId) {
    return (
      <div className="embed-media">
        <div className="embed-media__load" aria-hidden="true">
          <span className="embed-media__play">◵</span>
          <span>video coming soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="embed-media">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="embed-media__load" onClick={() => setLoaded(true)}>
          <span className="embed-media__play" aria-hidden="true">▶</span>
          <span>load video</span>
        </button>
      )}
    </div>
  );
}
