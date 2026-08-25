// Mercy Land — House World: content registry (spec §4)
// ONE overlay shell + this registry. ContentId → component. Two hosts consume these:
// the transient OverlayShell and the persistent ScenePanel. A content component must NOT
// assume it is dismissible or that it is the only thing on screen — it works in either host.
//
// TODO for Claude Code: implement each stub per spec §4. Media components MUST follow the
// embedded-media contract: unmount iframes on close (never hide), lazy-mount on open, reserve
// aspect ratio, cap ~2 simultaneous embeds, use youtube-nocookie. See BUILD.md.

import type { ComponentType } from 'react';
import type { ContentId } from '../types/world.types';
import { EmailSignup } from '../components/world/content/email-signup';
import { LjConversation } from '../components/world/content/lj-conversation';
import { FlagStatement } from '../components/world/content/flag-statement';
import { MonsterDenied } from '../components/world/content/monster-denied';
import { SummertimeVideo } from '../components/world/content/summertime-video';
import { SummertimeBTS } from '../components/world/content/summertime-bts';
import { btsPhotos, type BtsPhoto } from '../lib/bts-assets';

// A content component receives whatever `props` the scene/hotspot passed (see ScenePanel.props
// and the overlay target's `props`). Keep each component's own state internal.
export type ContentComponent = ComponentType<Record<string, unknown>>;

// ── Editable content data (band-authored; not UI) ────────────────────────────

// Shared LJ conversation panel, keyed per scene (Issue 5: one component, many messages).
export const ljMessages: Record<string, string[]> = {
  void: [
    'TODO — LJ message(s) shown in the void room',
  ],
  chat: [
    "hi! It's nice to see someone in here for once. I was just on Chat World, wanna see?",
  ],
};

// flag_void panel. Band statement (from the launch graph §7). TODO: fill the two producer names.
export const flagStatement = `***** *** *** M*RCY L*ND, *** ***** ****, ** *** ***.

******************************`

// summertime overlays.
// "knock on the door" → this video. https://www.youtube.com/watch?v=4YQhCj5s1Uc
export const summertimeYouTubeId = '4YQhCj5s1Uc';

// "spy on them" → every photo in src/assets/images/summertime_bts/. To add BTS photos, drop
// image files in that folder — nothing here needs editing. See src/lib/bts-assets.ts.
//
// CAPTIONS (optional, keyed by filename). Write one and it appears under the photo AND becomes
// the photo's alt text for screen readers. Leave it '' — or leave the photo out entirely — and
// the photo shows with no caption. An entry whose file no longer exists is simply ignored, so
// stale keys are harmless. Keep them short; this sits in a small overlay.
export const btsCaptions: Record<string, string> = {
  '01.jpeg': 'alt dress 1: i bought this one',
  '02.jpeg': 'alt dress 2: always flirting w prarie girl',
  '03.jpeg': 'alt dress 3: this is not my color',
  '04.JPG': 'sunlight streaming thru the window',
  '05.jpeg': 'theyre ideating',
  '06.jpeg': 'my pov of sam + brett.. guys im baking here',
  '07.jpeg': 'hannah pov of movie magic (before we used a fog machine in her oven)',
  '08.JPG': 'look at my cake :~)',
  '09.jpeg': 'me & my husband we are doing better',
  '10.JPG': 'he can get out of this',
  '11.jpeg': 'post shoot burgers at maries. this photo makes me emo </3',
};

export const summertimeBTSPhotos: BtsPhoto[] = btsPhotos.map((photo) => ({
  ...photo,
  caption: btsCaptions[photo.name] || undefined,
}));

// ── Registry ─────────────────────────────────────────────────────────────────
// All content components are implemented and imported above. Panels: emailSignup (mailbox form),
// ljConversation (computer rooms), flagStatement (flag_void). Overlays: monsterDenied,
// summertimeVideo, summertimeBTS. Each works in either host (spec §4).

export const contentRegistry: Record<ContentId, ContentComponent> = {
  emailSignup: EmailSignup,
  ljConversation: LjConversation,
  flagStatement: FlagStatement,
  monsterDenied: MonsterDenied,
  summertimeVideo: SummertimeVideo,
  summertimeBTS: SummertimeBTS,
};
