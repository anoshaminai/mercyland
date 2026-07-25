// Mercy Land — House World: launch scene data
// THIS FILE IS THE SOURCE OF TRUTH for the world. Iterate here.
// The markdown launch-scene-graph was its draft; this supersedes it.
//
// ─────────────────────────────────────────────────────────────────────────────
// DATA STILL TO FILL (each marked `TODO` inline):
//   • anchor coords — ALL are placeholder estimates; tune against the real images
//   • focal.x / mobileZoom per pannable scene — tune on a real phone (mobile panning is LIVE off
//     `imageWide`; `imageTall` is now an optional upgrade, not a blocker)
//   • song 01 streaming URL (start_house)
//   • summertime YouTube id + BTS photos (content-registry.tsx)
//   • LJ conversation messages (content-registry.tsx, ljMessages)
//   • display titles: computer_room_void, computer_room_chat_world, flag_void
//   • flag statement producer names (content-registry.tsx)
//
// RESOLVED (folded in from graph review):
//   • Issue 1  — computer_room_void now links to computer_room_chat_world (no longer orphaned)
//   • Issue 3  — old landing lives at /termites (nav item 'termites'); /flat redirects there
//   • Issue 4  — desert "trespass" stays `external`; summertime "party" stays `overlay` (intentional)
//   • Issue 5  — ljConversation is ONE shared component, fed per-scene via props.messageKey
//   • Issue 6  — interior/void scenes marked layout:'static' (no panning)
// ─────────────────────────────────────────────────────────────────────────────

import type { Scene, SceneId, WorldConfig } from '../types/world.types';

const scenes: Record<SceneId, Scene> = {
  // ── EXTERIOR / START ───────────────────────────────────────────────────────
  start_house: {
    id: 'start_house',
    title: "Neighbor's House",
    layout: 'pannable',
    imageWide: 'start_house.png',
    focal: { x: 0.5, y: 0.55 },        // TODO tune: the point held centre-screen on mobile
    mobileZoom: 1,                     // cover-fit. 16:9 source on a phone ≈ 2.6 screens of pan
    maxVisibleLabels: 4,               // 7 hotspots → 3 lowest-priority become edge/panned
    hotspots: [
      { id: 'computer', label: 'use computer room', anchor: { x: 0.66, y: 0.5 }, priority: 1,
        target: { type: 'travel', sceneId: 'computer_room_void' } },
      { id: 'mail', label: 'check mail', anchor: { x: 0.5, y: 0.62 }, priority: 2,
        target: { type: 'travel', sceneId: 'mailbox' } },
      { id: 'gohome', label: 'go home', anchor: { x: 0.5, y: 0.86 }, priority: 3,
        target: { type: 'travel', sceneId: 'house_monster' } },
      { id: 'song01', label: 'song 01', anchor: { x: 0.4, y: 0.35 }, priority: 4,
        target: { type: 'external', url: 'https://open.spotify.com/playlist/4LnrmDKBwdlSDkTOxLWIUV?si=129fed00f4df4168' } },
      { id: 'neighborhood', label: 'explore the neighborhood', labelShort: 'neighborhood',
        anchor: { x: 0.06, y: 0.55 }, priority: 5, // left edge → edge indicator on mobile
        target: { type: 'travel', sceneId: 'desert_house' } },
      { id: 'parents', label: "visit parents' friends", labelShort: "parents' friends",
        anchor: { x: 0.94, y: 0.55 }, priority: 6, // right edge
        target: { type: 'travel', sceneId: 'summertime_house' } },
      { id: 'flag', label: 'steal the flag', anchor: { x: 0.47, y: 0.42 }, priority: 7,
        target: { type: 'travel', sceneId: 'flag_void' } },
    ],
  },

  // ── EXTERIOR / NEIGHBORHOOD ─────────────────────────────────────────────────
  desert_house: {
    id: 'desert_house',
    title: "Scary Neighbor's House",
    layout: 'pannable',
    imageWide: 'desert_house.png',
    focal: { x: 0.5, y: 0.5 },
    mobileZoom: 0.75,                   // only 1 hotspot — pull back so there's less empty roaming
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'trespass', label: 'trespass', anchor: { x: 0.5, y: 0.55 }, priority: 1,
        target: { type: 'external', url: 'https://www.youtube.com/watch?v=fRFkrM11FyE' } }, // intentional external
    ],
  },

  summertime_house: {
    id: 'summertime_house',
    title: "Parents' Friend's House",
    layout: 'pannable',
    imageWide: 'blue_house.png',
    focal: { x: 0.5, y: 0.55 },
    mobileZoom: 1,                    // cover-fit; hotspots reach the left edge, so keep the travel
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'party', label: 'enter the party', anchor: { x: 0.5, y: 0.6 }, priority: 1,
        target: { type: 'overlay', content: 'summertimeVideo' } },
      { id: 'spy', label: 'spy', anchor: { x: 0.32, y: 0.45 }, priority: 2,
        target: { type: 'overlay', content: 'summertimeBTS' } },
      { id: 'gohome', label: 'go home', anchor: { x: 0.06, y: 0.5 }, priority: 3, // left edge
        target: { type: 'travel', sceneId: 'house_monster' } },
    ],
  },

  // ── STATIC / TRAP + LORE ────────────────────────────────────────────────────
  house_monster: {
    id: 'house_monster',
    title: 'Do you want to go home?',
    layout: 'static',
    imageWide: 'house_monster.png', // NOTE: rename asset from "house monster.png" (no space)
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'gohome', label: 'go home', anchor: { x: 0.35, y: 0.8 }, priority: 1,
        target: { type: 'overlay', content: 'monsterDenied' } },
      { id: 'stay', label: 'stay here', anchor: { x: 0.65, y: 0.5 }, priority: 2, // inversion is the joke
        target: { type: 'travel', sceneId: 'start_house' } },
    ],
  },

  // ── STATIC / MAILBOX (panel-only) ───────────────────────────────────────────
  mailbox: {
    id: 'mailbox',
    title: 'Sign Up to Hear from Mercy Land',
    layout: 'static',
    imageWide: 'hoops.png', 
    imageTall: 'start_house_tall.png', // TODO wide portrait crop
    focal: { x: 0.5, y: 0.5 },
    hotspots: [],
    panel: { content: 'emailSignup' },
  },

  // ── STATIC / VOID INTERIORS ─────────────────────────────────────────────────
  computer_room_void: {
    id: 'computer_room_void',
    title: '', // TODO
    layout: 'static',
    imageWide: 'void.jpg',
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'void', label: 'look at void', anchor: { x: 0.5, y: 0.5 }, priority: 1,
        target: { type: 'enter', route: '/void' } },
      // Issue 1 fix — re-added path to chat world, anchored to the (pink) lava lamp:
      { id: 'pinkthing', label: "what's that pink thing?", anchor: { x: 0.8, y: 0.6 }, priority: 2,
        target: { type: 'travel', sceneId: 'computer_room_chat_world' } },
    ],
    panel: { content: 'ljConversation', props: { messageKey: 'void' } },
  },

  computer_room_chat_world: {
    id: 'computer_room_chat_world',
    title: '', // TODO
    layout: 'static',
    imageWide: 'lj_chat_world.jpg', // NOTE: rename asset from "LJ chat world.jpg"
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'chat', label: 'open chat world', anchor: { x: 0.5, y: 0.5 }, priority: 1,
        target: { type: 'enter', route: '/chat-world' } },
      { id: 'void', label: 'look at void instead', anchor: { x: 0.78, y: 0.55 }, priority: 2,
        target: { type: 'enter', route: '/void' } },
      { id: 'imgood', label: 'im good', anchor: { x: 0.5, y: 0.85 }, priority: 3,
        target: { type: 'travel', sceneId: 'start_house' } },
    ],
    panel: { content: 'ljConversation', props: { messageKey: 'chat' } },
  },

  // ── STATIC / FLAG STATEMENT (animated bg, panel-only) ───────────────────────
  flag_void: {
    id: 'flag_void',
    title: '', // TODO
    layout: 'static',
    imageWide: 'flag.gif', // animated — loop + reduced-motion fallback (see BUILD.md)
    focal: { x: 0.5, y: 0.5 },
    hotspots: [],
    panel: { content: 'flagStatement' },
  },
};

export const world: WorldConfig = {
  startSceneId: 'start_house',
  scenes,
};

export default world;
