// Mercy Land — House World: Scene (spec v4 §1, §5; graph Issue 6)
// One navigable location: photo in the decorative frame + anchored hotspots + universal returns
// (+ optional persistent panel). Stays GENERIC — it knows nothing about which scenes exist or
// what a hotspot does. Navigation is delegated to callbacks; the world graph lives in data.
//
// Two layouts:
//   • static   — interior/void scenes: image contain-fit, centered, no panning.
//   • pannable — exterior scenes on MOBILE: the portrait crop (authored wider than the viewport)
//                renders in a horizontally pannable window with edge indicators and
//                focus-driven panning (the accessibility floor). On desktop, pannable shows the
//                whole scene at once (open decision §1: desktop = full scene, panning is mobile).
//
// NOTE: every scene's `imageTall` is still a TODO. Until a wider-than-viewport portrait crop
// exists, mobile contain-fits `imageWide` and panning correctly no-ops (spec §5). The pannable
// path below engages automatically once tall crops are authored — no code change.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import type { Hotspot as HotspotData, Scene as SceneData, ScenePanel } from '../../types/world.types';
import { resolveSceneAsset } from '../../lib/scene-assets';
import { Hotspot } from './hotspot';
import { EdgeIndicator } from './edge-indicator';
import '../../styles/world.css';

const MOBILE_QUERY = '(max-width: 640px)';
const EDGE_MARGIN = 28; // px inside the frame before a hotspot counts as off-viewport

export interface SceneProps {
  scene: SceneData;
  /** A hotspot fired one of the non-external target types. The host owns what each does. */
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
  const useTall = scene.layout === 'pannable' && isMobile && !!tallSrc;
  const src = useTall ? tallSrc : wideSrc;

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

  // Image box size: image aspect, fit to the stage (contain), or fill-height when panning.
  const { boxW, boxH, canPan } = useMemo(() => {
    if (!aspect || !stage.w || !stage.h) return { boxW: stage.w, boxH: stage.h, canPan: false };
    if (useTall) {
      const bw = stage.h * aspect;
      return { boxW: bw, boxH: stage.h, canPan: bw > stage.w + 1 };
    }
    // contain-fit
    if (stage.w / stage.h > aspect) return { boxW: stage.h * aspect, boxH: stage.h, canPan: false };
    return { boxW: stage.w, boxH: stage.w / aspect, canPan: false };
  }, [aspect, stage.w, stage.h, useTall]);

  const clampPan = useCallback((x: number) => Math.min(0, Math.max(stage.w - boxW, x)), [stage.w, boxW]);

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
    if (!canPan) {
      panX.set(0);
      return;
    }
    panX.set(clampPan(stage.w / 2 - boxW * scene.focal.x));
  }, [canPan, clampPan, stage.w, boxW, scene.focal.x, panX]);

  // Focus that lands on an off-viewport hotspot must pan it into view (§5).
  const handleHotspotFocus = useCallback(
    (h: HotspotData) => {
      if (!canPan) return;
      const screenX = boxW * h.anchor.x + panX.get();
      if (screenX < EDGE_MARGIN || screenX > stage.w - EDGE_MARGIN) panToHotspot(h);
    },
    [canPan, boxW, panX, stage.w, panToHotspot],
  );

  // Per-hotspot viewport state → drives edge indicators and the density-cap collapse.
  const rendered = useMemo(() => {
    return scene.hotspots.map((h) => {
      const screenX = canPan ? boxW * h.anchor.x + panXState : null;
      const offLeft = screenX !== null && screenX < EDGE_MARGIN;
      const offRight = screenX !== null && screenX > stage.w - EDGE_MARGIN;
      return { h, off: offLeft || offRight, side: offLeft ? ('left' as const) : ('right' as const) };
    });
  }, [scene.hotspots, canPan, boxW, panXState, stage.w]);

  // Density cap (§5): among hotspots currently in the viewport, keep only the highest-priority
  // `maxVisibleLabels` as full labels; the rest collapse to markers (still focusable). Mobile only.
  const collapsedIds = useMemo(() => {
    const cap = scene.maxVisibleLabels;
    if (!canPan || !cap) return new Set<string>();
    const inView = rendered.filter((r) => !r.off).map((r) => r.h);
    if (inView.length <= cap) return new Set<string>();
    const overflow = [...inView]
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .slice(cap);
    return new Set(overflow.map((h) => h.id));
  }, [rendered, canPan, scene.maxVisibleLabels]);

  return (
    <section className="scene" aria-label={scene.title || scene.id}>
      <div className="scene__stage" ref={stageRef}>
        {src ? (
          <motion.div
            className={`scene__box${canPan ? ' scene__box--pannable' : ''}`}
            style={{ x: panX, width: boxW || undefined, height: boxH || undefined }}
            drag={canPan ? 'x' : false}
            dragConstraints={{ left: Math.min(0, stage.w - boxW), right: 0 }}
            dragElastic={0.04}
            dragMomentum={false}
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
            {scene.hotspots.map((h) => (
              <Hotspot
                key={h.id}
                hotspot={h}
                onActivate={onActivate}
                onFocus={handleHotspotFocus}
                collapsed={collapsedIds.has(h.id)}
              />
            ))}
          </motion.div>
        ) : (
          // Asset missing (e.g. mailbox photo TODO): don't break — panel/returns still work.
          <div className="scene__box" style={{ width: stage.w, height: stage.h }} />
        )}

        {/* Edge indicators live in the (un-panned) stage, parked at the frame. aria-hidden —
            the real hotspot buttons above are the accessible controls. */}
        {canPan &&
          rendered
            .filter((r) => r.off)
            .map((r) => (
              <EdgeIndicator
                key={`edge-${r.h.id}`}
                hotspot={r.h}
                side={r.side}
                top={Math.min(Math.max(r.h.anchor.y * boxH, 30), Math.max(stage.h - 30, 30))}
                onPan={panToHotspot}
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
