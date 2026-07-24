// Mercy Land — House World: type definitions
// Contracts for these types live in the site spec (v4). This file is the schema;
// scenes.data.ts is the content. Keep behavior in components, not here.

/** Every scene that exists. Adding a scene = adding an id here + a block in scenes.data.ts.
 *  Because `travel` targets are typed to this union, a mistyped or missing destination is a
 *  COMPILE error — this is what prevents the orphan/broken-link class of bug. */
export type SceneId =
  | 'start_house'
  | 'desert_house'
  | 'summertime_house'
  | 'house_monster'
  | 'mailbox'
  | 'computer_room_void'
  | 'computer_room_chat_world'
  | 'flag_void';

/** Registry content keys (spec §4). One component per id; shared components (e.g. ljConversation)
 *  are fed different data via `props`. */
export type ContentId =
  | 'emailSignup'
  | 'ljConversation'
  | 'flagStatement'
  | 'monsterDenied'
  | 'summertimeVideo'
  | 'summertimeBTS';

/** pannable → exterior scenes: wider-than-viewport portrait crop, edge indicators, focus-driven
 *              panning (spec §5).
 *  static   → interior/void scenes: full-bleed centered background, no panning (graph Issue 6). */
export type SceneLayout = 'pannable' | 'static';

export interface Vec2 {
  x: number;
  y: number;
}

export type HotspotTarget =
  | { type: 'travel'; sceneId: SceneId }                                   // to another scene
  | { type: 'enter'; route: string }                                      // on-site route (/void, /chat)
  | { type: 'overlay'; content: ContentId; props?: Record<string, unknown> } // registry content, in place
  | { type: 'external'; url: string };                                    // off-site URL

export interface Hotspot {
  id: string;
  label: string;
  labelShort?: string;   // shorter form for mobile / edge state
  anchor: Vec2;          // normalized 0–1 on the FULL scene image (stable across pan/viewport)
  offset?: Vec2;         // optional: nudge label off a busy feature (+ connector line)
  priority?: number;     // lower = kept in view under the density cap (spec §5); also tab order
  target: HotspotTarget;
  visited?: boolean;     // reserved — lit/dark progression, unwired
  locked?: boolean;      // reserved — gating, unwired
}

export interface ScenePanel {
  content: ContentId;
  props?: Record<string, unknown>;
}

export interface Scene {
  id: SceneId;
  title: string;
  layout: SceneLayout;
  imageWide: string;         // filename in assets/images/scenes/, resolved by the loader (see BUILD.md)
  imageTall?: string;        // required for `pannable`; must be wider than the portrait viewport
  focal: Vec2;               // initial viewport position (pannable) / framing center (static)
  maxVisibleLabels?: number; // mobile density cap; excess hotspots become edge indicators
  hotspots: Hotspot[];       // [] is valid (e.g. panel-only scenes)
  panel?: ScenePanel;        // persistent in-scene content (mailbox form, lore text)
}

export interface WorldConfig {
  startSceneId: SceneId;              // where `return to start` goes
  scenes: Record<SceneId, Scene>;
}
