// Mercy Land — House World: summertimeVideo content (overlay · summertime "join the party")
// The YouTube id is band-authored data (content-registry.tsx). Accepts an optional `youtubeId`
// prop (from the hotspot's overlay props) and falls back to the registry constant, so filling in
// the real id later touches one line of data and no UI.

import { EmbeddedVideo } from './embedded-video';
import { summertimeYouTubeId } from '../../../data/content-registry';

export function SummertimeVideo(props: Record<string, unknown>) {
  const youtubeId = typeof props.youtubeId === 'string' ? props.youtubeId : summertimeYouTubeId;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1.5rem', margin: '0 0 14px' }}>
        the party
      </h2>
      <EmbeddedVideo youtubeId={youtubeId} title="Mercy Land — summertime" />
    </div>
  );
}
