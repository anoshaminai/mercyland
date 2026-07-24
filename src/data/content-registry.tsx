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
export const flagStatement = `THANK GOD FOR MERCY LAND, our debut album, is out now. This album was borne out of 30 years of life times 2 so 60 years of life. I heard this album on hot afternoons home alone as a pre-teen, on late nights wandering West Philadelphia as a teenager, finally drawn out of us in one glorious spring in New Orleans, when the clouds and the longing and the weight of LIFE crushed and cracked us but didn't break us. We took inspiration from the songwriting greats like Bruce and Lucinda and Lana — fierce American souls conjuring magical melodies and poetry — from the brilliant producers like [TODO] [TODO].

I'm not supposed to say this because I'm supposed to make it simple for you, where the music came from and what it's about. But I am saying it to you anyway because I think you know what I mean, that all the things you love can become part of you. All of us are so much more than just one or two references, one or two frames of mind.

Listen to it while driving in your car nowhere in particular, listen to it while doing the dishes and dancing in the mirror, listen to it on a long run, listen to it when you can't get to the ocean and you want water to crash over you like a wave, listen to it when you're stuck, when you're excited, when you feel darkness hanging around you and you want to wrap it around you like a cloak!! Like a veil!!

We've lived so many lives already in this beautiful, brutal country. Bored to death by the monotony of school and work, reckless agents of our own destruction in so many downtowns, pathetic creatures seeking refuge in mountains and bayous. No matter how bad it gets I can't help but say — thank god for this — for this life and this world. Thank God for Mercy Land.`;

// ── Component stubs — implement per spec §4 ──────────────────────────────────
// Replace each `Stub` with a real component. Signatures shown for the props each receives.

/** scene panel · mailbox. Formspree `mldnjygq` behind a single integration module (spec §8). */
const EmailSignup: ContentComponent = () => null; // TODO

/** scene panel · both computer rooms. props: { messageKey: 'void' | 'chat' } → ljMessages[key] */
const LjConversation: ContentComponent = () => null; // TODO

/** scene panel · flag_void. Renders `flagStatement`. */
const FlagStatement: ContentComponent = () => null; // TODO

/** overlay · house_monster "go home". Short denial text: "You're not ready to go home <3" */
const MonsterDenied: ContentComponent = () => null; // TODO

/** overlay · summertime "join the party". YouTube embed. props: { youtubeId } TODO get id */
const SummertimeVideo: ContentComponent = () => null; // TODO (youtube-nocookie, unmount on close)

/** overlay · summertime "spy on the party". Image gallery. props: { images: string[] } TODO */
const SummertimeBTS: ContentComponent = () => null; // TODO

export const contentRegistry: Record<ContentId, ContentComponent> = {
  emailSignup: EmailSignup,
  ljConversation: LjConversation,
  flagStatement: FlagStatement,
  monsterDenied: MonsterDenied,
  summertimeVideo: SummertimeVideo,
  summertimeBTS: SummertimeBTS,
};
