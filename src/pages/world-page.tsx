// Mercy Land — House World: the world root (`/`). The navigable landing (v2-site.md).
// Owns scene state, the history stack, and the two universal returns, and delegates each hotspot
// target: travel (in-world), enter (route out to an experience), overlay (OverlayShell + registry),
// external (navigation happens inside Hotspot; it still reports here so handleActivate is the one
// instrumented choke point). Persistent scene content renders via ScenePanel. Scenes are
// local state under one route; `enter` targets are the real cross-experience routes.

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { world } from '../data/scenes.data';
import { contentRegistry } from '../data/content-registry';
import type { ContentId, Hotspot, ScenePanel as ScenePanelData, SceneId } from '../types/world.types';
import { Scene } from '../components/world/scene';
import { OverlayShell } from '../components/world/overlay-shell';
import { ScenePanel } from '../components/world/scene-panel';
import { track } from '../lib/analytics';

interface OverlayState {
  content: ContentId;
  props?: Record<string, unknown>;
}

export function WorldPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<SceneId>(world.startSceneId);
  const [, setHistory] = useState<SceneId[]>([]);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  const scene = world.scenes[current];

  const travel = useCallback((to: SceneId) => {
    setHistory((h) => [...h, current]);
    setCurrent(to);
  }, [current]);

  const handleActivate = useCallback((h: Hotspot) => {
    const t = h.target;

    // Analytics: THE choke point — every hotspot activation, whatever the target, is one
    // hotspot_click (specs/analytics.md). Fired before navigation so the event survives an
    // `external` target taking the tab away. `from` is not decoration: Hotspot.id is only unique
    // within a scene ('gohome' lives in three), so from+hotspot is the real key.
    const target =
      t.type === 'travel'  ? t.sceneId :
      t.type === 'enter'   ? t.route   :
      t.type === 'overlay' ? t.content : t.url;
    track('hotspot_click', {
      from: current, hotspot: h.id, label: h.label, target_type: t.type, target,
    });

    switch (t.type) {
      case 'travel':
        travel(t.sceneId);
        break;
      case 'enter':
        navigate(t.route);
        break;
      case 'overlay':
        setOverlay({ content: t.content, props: t.props });
        break;
      case 'external':
        // Nothing to do — Hotspot renders these as a real <a> and the browser has already opened
        // the new tab. It still calls onActivate so this stays the single instrumented choke point.
        break;
    }
  }, [travel, navigate, current]);

  const handleBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        setCurrent(world.startSceneId); // degrade to start when no history (§3)
        return h;
      }
      setCurrent(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  const handleReturnToStart = useCallback(() => {
    setCurrent(world.startSceneId);
    setHistory([]);
  }, []);

  // Persistent scene content, hosted from the registry (spec §4). Scene provides the fixed
  // foreground frame; ScenePanel resolves the content id.
  const renderPanel = useCallback((panel: ScenePanelData) => <ScenePanel panel={panel} />, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <Scene
            scene={scene}
            onActivate={handleActivate}
            onBack={handleBack}
            onReturnToStart={handleReturnToStart}
            renderPanel={renderPanel}
          />
        </motion.div>
      </AnimatePresence>

      {/* One shell, reused for every overlay id (spec §4). Mounted only while open, so its
          content (and any iframes) unmounts on close. */}
      {overlay
        ? (() => {
            const Content = contentRegistry[overlay.content];
            return (
              <OverlayShell
                scene={current}
                content={overlay.content}
                onClose={() => setOverlay(null)}
              >
                <Content {...(overlay.props ?? {})} />
              </OverlayShell>
            );
          })()
        : null}
    </>
  );
}
