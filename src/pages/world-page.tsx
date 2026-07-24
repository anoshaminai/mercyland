// Mercy Land — House World: verification host for the generic Scene/Hotspot components.
// Owns scene state, the history stack, and the two universal returns, and delegates each hotspot
// target to a handler. `overlay` targets now render the real OverlayShell + content registry
// (spec §4). Scene panels are still a stub here — the ScenePanel host is the next step. Wiring
// the world root `/` to this is also still pending.

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { world } from '../data/scenes.data';
import { contentRegistry } from '../data/content-registry';
import type { ContentId, Hotspot, ScenePanel, SceneId } from '../types/world.types';
import { Scene } from '../components/world/scene';
import { OverlayShell } from '../components/world/overlay-shell';

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
      // 'external' is a plain <a> inside Hotspot and never reaches here.
    }
  }, [travel, navigate]);

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

  // WIP panel host — ScenePanel + content-registry components are the next step.
  const renderPanel = useCallback((panel: ScenePanel) => (
    <div style={{ fontSize: 13, lineHeight: 1.5, textAlign: 'center', opacity: 0.85 }}>
      <div style={{ fontFamily: 'var(--font-secondary)', fontSize: 16, marginBottom: 6 }}>
        scene panel
      </div>
      <code>{panel.content}</code>
      <div style={{ opacity: 0.6, marginTop: 6 }}>(content component — next step)</div>
    </div>
  ), []);

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
              <OverlayShell label={overlay.content} onClose={() => setOverlay(null)}>
                <Content {...(overlay.props ?? {})} />
              </OverlayShell>
            );
          })()
        : null}
    </>
  );
}
