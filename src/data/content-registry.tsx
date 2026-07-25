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
    'TODO — LJ message(s) shown in the chat-world room',
  ],
};

// flag_void panel. Band statement (from the launch graph §7). TODO: fill the two producer names.
export const flagStatement = `***** *** *** M*RCY L*ND, *** ***** ****, ** *** ***.

******************************`

// summertime overlays. TODO: fill with the real YouTube id + behind-the-scenes image URLs.
export const summertimeYouTubeId = ''; // TODO get id
export const summertimeBTSImages: string[] = []; // TODO add BTS photos

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
