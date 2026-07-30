// Mercy Land — House World: Scene (spec v4 §1, §5; graph Issue 6)
// One navigable location: photo in the decorative frame + anchored hotspots + universal returns
// (+ optional persistent panel). Stays GENERIC — it knows nothing about which scenes exist or
// what a hotspot does. Navigation is delegated to callbacks; the world graph lives in data.
//
// Two layouts:
//   • static   — interior/void scenes: image contain-fit, centered, no panning.
//   • pannable — exterior scenes on MOBILE: the photo is COVER-fit (scaled up until it fills the
//                stage) and the overflow becomes pan travel, with edge indicators and
//                focus-driven panning (the accessibility floor). On desktop, pannable shows the
//                whole scene at once (open decision §1: desktop = full scene, panning is mobile).
//
// Panning does NOT depend on a bespoke portrait crop. Cover-fit is computed from whatever source
// is available, so a 16:9 `imageWide` on a phone is already ~2.5 viewports wide. `imageTall` is an
// optimisation (better mobile composition, fewer wasted pixels) picked up automatically when one
// exists; `scene.mobileZoom` + `scene.focal` are the knobs that make the wide source read well.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import type { Hotspot as HotspotData, Scene as SceneData, ScenePanel } from '../../types/world.types';
import { resolveSceneAsset } from '../../lib/scene-assets';
import { useTrackOnce } from '../../hooks/use-track-once';
import { Hotspot } from './hotspot';
import { EdgeIndicator } from './edge-indicator';
import '../../styles/world.css';

const MOBILE_QUERY = '(max-width: 640px)';
const EDGE_MARGIN = 28; // px inside the frame before a hotspot counts as off-viewport
const LABEL_SAFE_ZONE = 120; // px from a frame edge within which a centred label would clip
const EDGE_STACK_GAP = 48; // px between stacked edge indicators — keep >= --hotspot-tap-min (44)
const EDGE_STACK_INSET = 30; // px the stack keeps clear of the top/bottom frame

/** Density-cap ranking (§5): lower `priority` wins. Shared by the in-frame collapse and the edge
 *  stack so the two halves of one budget can never drift apart. */
const byPriority = (a: HotspotData, b: HotspotData) => (a.priority ?? 99) - (b.priority ?? 99);

export interface SceneProps {
  scene: SceneData;
  /** A hotspot was activated. The host owns what each target type does — note `external` reports
   *  here too but has already navigated itself (see Hotspot). */
  onActivate: (hotspot: HotspotData) => void;
  /** Universal return: pop one hop of history (host degrades to start when none, spec §3). */
  onBack: () => void;
  /** Universal return: jump to the start scene (the safety anchor, spec §3). */
  onReturnToStart: () => void;
  /** Optional render slot for `scene.panel` — the ScenePanel host (spec §4) lives outside Scene
   *  so Scene stays generic. Until it exists, callers may omit it. */
  renderPanel?: (panel: ScenePanel) => ReactNode;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function Scene({ scene, onActivate, onBack, onReturnToStart, renderPanel }: SceneProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const wideSrc = resolveSceneAsset(scene.imageWide);
  const tallSrc = resolveSceneAsset(scene.imageTall);
  // The pannable *view* is a property of layout + viewport, not of which crop happens to exist.
  const isPannableView = scene.layout === 'pannable' && isMobile;
  const src = (isPannableView && tallSrc) || wideSrc;

  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [aspect, setAspect] = useState(0); // image natural w/h; 0 until loaded
  const panX = useMotionValue(0);
  const [panXState, setPanXState] = useState(0);

  // Measure the stage.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setStage({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setStage({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Reset aspect when the source changes (mode/scene switch) so we re-measure the new image.
  useEffect(() => setAspect(0), [src]);

  // Mirror the pan motion value into state so edge indicators recompute as the viewport moves.
  useEffect(() => {
    setPanXState(panX.get());
    const unsub = panX.on('change', setPanXState);
    return unsub;
  }, [panX]);

  // Image box size. Two fits, both derived from the photo's own aspect:
  //   contain — the whole photo inside the stage (desktop, and every `static` scene).
  //   cover   — the smallest scale that leaves no letterbox; the excess width is pan travel.
  //             `mobileZoom` multiplies it (>1 pushes in and crops vertically, <1 pulls back and
  //             letterboxes), clamped so a bad value can never shrink below contain.
  const { boxW, boxH, canPan } = useMemo(() => {
    if (!aspect || !stage.w || !stage.h) return { boxW: stage.w, boxH: stage.h, canPan: false };
    const fillH = stage.h * aspect; // width the photo would have if it filled the stage height
    const containW = Math.min(stage.w, fillH);
    if (!isPannableView) {
      // `fit: 'cover'` — the box IS the stage and `object-fit: cover` crops the overflow, so the
      // image runs edge-to-edge with no letterbox bands. Hotspot anchors stay normalized against
      // this box, i.e. against the visible crop.
      if (scene.fit === 'cover') return { boxW: stage.w, boxH: stage.h, canPan: false };
      return { boxW: containW, boxH: containW / aspect, canPan: false };
    }
    const coverW = Math.max(stage.w, fillH);
    const bw = Math.max(containW, coverW * (scene.mobileZoom ?? 1));
    return { boxW: bw, boxH: bw / aspect, canPan: bw > stage.w + 1 };
  }, [aspect, stage.w, stage.h, isPannableView, scene.mobileZoom, scene.fit]);

  // `panX` is the box's absolute left offset within the stage (the box is positioned top-left, so
  // centring is part of this number, not a separate CSS concern — mixing the two silently broke
  // the clamp range). When the photo is narrower than the stage there is nothing to pan: centre.
  const clampPan = useCallback(
    (x: number) =>
      boxW <= stage.w ? (stage.w - boxW) / 2 : Math.min(0, Math.max(stage.w - boxW, x)),
    [stage.w, boxW],
  );

  // Vertical framing is fixed (panning is horizontal only, §5): hold `focal.y` at the centre when
  // the photo overflows the stage, otherwise centre the letterboxed box.
  const offsetY = useMemo(
    () =>
      boxH <= stage.h
        ? (stage.h - boxH) / 2
        : Math.min(0, Math.max(stage.h - boxH, stage.h / 2 - boxH * scene.focal.y)),
    [boxH, stage.h, scene.focal.y],
  );

  // Mobile marker mode (§5): hotspots render as bare markers and the first tap reveals the label
  // rather than navigating. At most one label is open at a time — panning around should not
  // accumulate a trail of open labels. Desktop keeps hover, so this never engages there.
  const markerMode = scene.collapseLabelsOnMobile === true && isMobile;
  const [revealedId, setRevealedId] = useState<string | null>(null);

  // Any scene/mode change drops the open label — it belongs to the scene you left.
  useEffect(() => setRevealedId(null), [scene.id, markerMode]);

  // Analytics: one entry = one scene_view (specs/analytics.md). Scene coverage is the headline
  // metric — the dropoff outward from start_house IS "how far they get".
  useTrackOnce('scene_view', { scene: scene.id }, scene.id);

  // Pan the viewport so a hotspot sits comfortably centered. Shared by focus-driven panning
  // (§5 accessibility floor) and edge-indicator taps. Never activates the hotspot.
  const panToHotspot = useCallback(
    (h: HotspotData) => {
      if (!canPan) return;
      const target = clampPan(stage.w / 2 - boxW * h.anchor.x);
      animate(panX, target, { duration: 0.42, ease: [0.22, 1, 0.36, 1] });
    },
    [canPan, clampPan, stage.w, boxW, panX],
  );

  // Initial framing from the focal point (re-applied on resize / mode change).
  useEffect(() => {
    panX.set(clampPan(stage.w / 2 - boxW * scene.focal.x));
  }, [clampPan, stage.w, boxW, scene.focal.x, panX]);

  // Focus that lands on an off-viewport hotspot must pan it into view (§5).
  const handleHotspotFocus = useCallback(
    (h: HotspotData) => {
      if (!canPan) return;
      const screenX = boxW * h.anchor.x + panX.get();
      if (screenX < EDGE_MARGIN || screenX > stage.w - EDGE_MARGIN) panToHotspot(h);
    },
    [canPan, boxW, panX, stage.w, panToHotspot],
  );

  // First tap on a marker: open its label and pan it clear of the frame, so the label it just
  // grew has room to be read instead of running off the edge (the clipping in the shipped build).
  const handleReveal = useCallback(
    (h: HotspotData) => {
      setRevealedId(h.id);
      panToHotspot(h);
    },
    [panToHotspot],
  );

  // Tapping the photo anywhere but on a hotspot closes the open label.
  const dismissRevealed = useCallback((e: ReactPointerEvent) => {
    if ((e.target as Element).closest('.hotspot')) return;
    setRevealedId(null);
  }, []);

  // Per-hotspot viewport state → drives edge indicators, the density-cap collapse, and which way
  // a near-edge label has to grow. `panXState` is the box's absolute left offset, so `screenX`
  // is valid for static scenes too — only `off` is gated on being pannable, because a scene that
  // cannot pan has no edge indicators.
  const rendered = useMemo(() => {
    return scene.hotspots.map((h) => {
      const screenX = boxW * h.anchor.x + panXState;
      const offLeft = canPan && screenX < EDGE_MARGIN;
      const offRight = canPan && screenX > stage.w - EDGE_MARGIN;
      const off = offLeft || offRight;
      let anchorSide: 'left' | 'right' | null = null;
      if (!off && stage.w) {
        if (screenX < LABEL_SAFE_ZONE) anchorSide = 'left';
        else if (screenX > stage.w - LABEL_SAFE_ZONE) anchorSide = 'right';
      }
      return { h, off, side: offLeft ? ('left' as const) : ('right' as const), anchorSide };
    });
  }, [scene.hotspots, canPan, boxW, panXState, stage.w]);

  // Edge indicators (§5): parked per side, ordered by anchor, de-overlapped, density-capped.
  // Without the de-overlap two hotspots with similar `anchor.y` render on top of each other;
  // without the cap a busy scene rings its own frame with them.
  const edgeIndicators = useMemo(() => {
    if (!canPan) return [];
    const cap = scene.maxVisibleLabels;
    // ONE budget across both sides. Capping per side would let a `cap: 4` scene park 8 indicators
    // around the frame — exactly the ringing the cap exists to prevent (§5). Which ones survive is
    // by priority; where they sit is by anchor.
    const all = rendered.filter((r) => r.off);
    const kept = cap && all.length > cap ? all.sort((a, b) => byPriority(a.h, b.h)).slice(0, cap) : all;
    const hi = Math.max(stage.h - EDGE_STACK_INSET, EDGE_STACK_INSET);
    return (['left', 'right'] as const).flatMap((side) => {
      let prev = -Infinity;
      return kept
        .filter((r) => r.side === side)
        .sort((a, b) => a.h.anchor.y - b.h.anchor.y)
        .map((r) => {
          const ideal = r.h.anchor.y * boxH + offsetY;
          const top = Math.min(Math.max(ideal, prev + EDGE_STACK_GAP, EDGE_STACK_INSET), hi);
          prev = top;
          return { h: r.h, side, top };
        });
    });
  }, [canPan, rendered, boxH, offsetY, stage.h, scene.maxVisibleLabels]);

  // Density cap (§5): among hotspots currently in the viewport, keep only the highest-priority
  // `maxVisibleLabels` as full labels; the rest collapse to markers (still focusable). Mobile only.
  const collapsedIds = useMemo(() => {
    const cap = scene.maxVisibleLabels;
    if (!canPan || !cap) return new Set<string>();
    const inView = rendered.filter((r) => !r.off).map((r) => r.h);
    if (inView.length <= cap) return new Set<string>();
    return new Set(inView.sort(byPriority).slice(cap).map((h) => h.id));
  }, [rendered, canPan, scene.maxVisibleLabels]);

  return (
    <section
      className="scene"
      aria-label={scene.title || scene.id}
      style={scene.background ? { background: scene.background } : undefined}
    >
      <div className="scene__stage" ref={stageRef} onPointerDown={dismissRevealed}>
        {src ? (
          <motion.div
            className={`scene__box${canPan ? ' scene__box--pannable' : ''}`}
            style={{ x: panX, y: offsetY, width: boxW || undefined, height: boxH || undefined }}
            drag={canPan ? 'x' : false}
            dragConstraints={{ left: Math.min(0, stage.w - boxW), right: 0 }}
            dragElastic={0.04}
            dragMomentum={false}
            onDragStart={() => setRevealedId(null)}
          >
            <img
              className="scene__img"
              src={src}
              alt={scene.title || scene.id}
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalHeight) setAspect(img.naturalWidth / img.naturalHeight);
              }}
            />
            {rendered.map(({ h, anchorSide }) => (
              <Hotspot
                key={h.id}
                hotspot={h}
                anchorSide={anchorSide}
                onActivate={onActivate}
                onFocus={handleHotspotFocus}
                // Revealed always wins over BOTH suppression mechanisms. Letting either one keep
                // a revealed hotspot collapsed means the first tap shows nothing and the second
                // navigates blind — which is the bug the edge-indicator summon exists to fix.
                collapsed={revealedId !== h.id && (markerMode || collapsedIds.has(h.id))}
                requireReveal={markerMode}
                revealed={revealedId === h.id}
                onReveal={handleReveal}
              />
            ))}
          </motion.div>
        ) : (
          // Asset missing (e.g. mailbox photo TODO): don't break — panel/returns still work.
          <div className="scene__box" style={{ width: stage.w, height: stage.h }} />
        )}

        {/* Edge indicators live in the (un-panned) stage, parked at the frame. aria-hidden —
            the real hotspot buttons above are the accessible controls. */}
        {edgeIndicators.map((r) => (
          <EdgeIndicator
            key={`edge-${r.h.id}`}
            hotspot={r.h}
            side={r.side}
            top={r.top}
            // Summon, not just pan — see edge-indicator.tsx.
            onSummon={handleReveal}
          />
        ))}
      </div>

      {/* Decorative frame + corner dots (cosmetic; never intercepts pointers). */}
      <div className="scene__frame" aria-hidden="true">
        <span className="scene__corner scene__corner--bl" />
        <span className="scene__corner scene__corner--br" />
      </div>

      {scene.title ? <h1 className="scene__title">{scene.title}</h1> : null}

      {scene.panel && renderPanel ? (
        <div className="scene__panel">{renderPanel(scene.panel)}</div>
      ) : null}

      {/* Universal returns — same position every scene; the two-item mobile thumb zone (§3, §5). */}
      <nav className="scene__returns" aria-label="scene returns">
        <button type="button" className="scene__return" onClick={onBack}>back</button>
        <button type="button" className="scene__return" onClick={onReturnToStart}>return to start</button>
      </nav>
    </section>
  );
}
