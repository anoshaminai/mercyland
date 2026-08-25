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
    // 7 labels at once buried the photo on a phone (and the edge ones were clipped mid-word).
    // Markers only; tap one to read it, tap again to go.
    collapseLabelsOnMobile: true,
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
      { id: 'parents', label: "what's that sound?", labelShort: "what's that?",
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
    title: "New Neighbor's House",
    layout: 'pannable',
    imageWide: 'blue_house.png',
    focal: { x: 0.5, y: 0.55 },
    mobileZoom: 1,                    // cover-fit; hotspots reach the left edge, so keep the travel
    maxVisibleLabels: 4,
    collapseLabelsOnMobile: true,     // same treatment as start_house: markers on mobile, tap to
                                      // read, tap again to go

    hotspots: [
      { id: 'party', label: 'knock on the door', anchor: { x: 0.5, y: 0.6 }, priority: 1,
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
    background: '#FFFFFF',          // the PNG is transparent — this colour IS the sky behind the
                                    // clouds. On black the illustration read as a cut-out.
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      // Anchored to the drawing, not the grid: `go home` sits under the lead house's grin,
      // `stay here` sits on the open door it is actually offering you.
      { id: 'gohome', label: 'go home', anchor: { x: 0.35, y: 0.64 }, priority: 1,
        target: { type: 'overlay', content: 'monsterDenied' } },
      { id: 'stay', label: 'stay here', anchor: { x: 0.8, y: 0.29 }, priority: 2, // inversion is the joke
        target: { type: 'travel', sceneId: 'start_house' } },
    ],
  },

  // ── STATIC / MAILBOX (panel-only) ───────────────────────────────────────────
  mailbox: {
    id: 'mailbox',
    title: 'Sign Up to Hear from Mercy Land',
    layout: 'static',
    imageWide: 'hoops.png',
    fit: 'cover',                      // full-bleed photo — contain left it a thin band in a
                                       // black field, which read as a broken image
    focal: { x: 0.5, y: 0.5 },
    hotspots: [],
    panel: { content: 'emailSignup' },
  },

  // ── STATIC / VOID INTERIORS ─────────────────────────────────────────────────
  computer_room_void: {
    id: 'computer_room_void',
    title: '', // TODO
    layout: 'static',
    imageWide: 'void_horizontal.jpeg',
    imageTall: 'void.jpg',
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      { id: 'void', label: 'look at void', anchor: { x: 0.5, y: 0.5 }, priority: 1,
        target: { type: 'enter', route: '/void' } },
      // Issue 1 fix — the path to chat world, anchored on the chair back (bottom right).
      { id: 'sit', label: 'sit in chair', anchor: { x: 0.86, y: 0.78 }, priority: 2,
        target: { type: 'travel', sceneId: 'computer_room_chat_world' } },
    ],
  },

  computer_room_chat_world: {
    id: 'computer_room_chat_world',
    title: '', // TODO
    layout: 'static',
    imageWide: 'lj_chat_world.jpg', // NOTE: rename asset from "LJ chat world.jpg"
    focal: { x: 0.5, y: 0.5 },
    maxVisibleLabels: 4,
    hotspots: [
      // On the monitor screen. Was y:0.5, which landed exactly under the scene panel back when
      // .scene__panel was centred; the panel is bottom-anchored now, but on the screen is where
      // this belongs anyway.
      { id: 'chat', label: 'open chat world', anchor: { x: 0.51, y: 0.32 }, priority: 1,
        target: { type: 'enter', route: '/chat-world' } },
      { id: 'void', label: 'look at void instead', anchor: { x: 0.78, y: 0.55 }, priority: 2,
        target: { type: 'enter', route: '/void' } },
    ],
    panel: { content: 'ljConversation', props: { messageKey: 'chat' } },
  },

  // ── STATIC / FLAG STATEMENT (animated bg, panel-only) ───────────────────────
  flag_void: {
    id: 'flag_void',
    title: '', // TODO
    layout: 'static',
    imageWide: 'flag.gif', // animated — loop + reduced-motion fallback (see BUILD.md)
    fit: 'cover',          // the stripes ARE the backdrop: run them to all four edges rather than
                           // floating a band of flag in black
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
