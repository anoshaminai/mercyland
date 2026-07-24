// Mercy Land — House World: verification host for the generic Scene/Hotspot components.
// This is the harness that lets us actually SEE and drive Scene + Hotspot this session. It owns
// scene state, the history stack, and the two universal returns, and delegates each hotspot
// target to a handler. The real integration surface (OverlayShell, ScenePanel, content-registry
// components, and wiring the world root `/`) is the NEXT step — the overlay + panel below are
// intentionally minimal stubs, clearly labeled.

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { world } from '../data/scenes.data';
import type { Hotspot, ScenePanel, SceneId } from '../types/world.types';
import { Scene } from '../components/world/scene';

export function WorldPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<SceneId>(world.startSceneId);
  const [, setHistory] = useState<SceneId[]>([]);
  const [overlay, setOverlay] = useState<{ content: string } | null>(null);

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
        setOverlay({ content: t.content });
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

      {/* Minimal overlay stub so `overlay` targets are visibly wired. Real OverlayShell next. */}
      {overlay ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOverlay(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 480, padding: 24, borderRadius: 10,
              background: 'var(--scene-panel-bg)', color: 'var(--hotspot-label-color)',
              fontFamily: 'var(--font-primary)', textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-secondary)', fontSize: 18, marginBottom: 8 }}>
              overlay
            </div>
            <code>{overlay.content}</code>
            <div style={{ opacity: 0.6, marginTop: 8, fontSize: 12 }}>
              (OverlayShell + content component — next step)
            </div>
            <button
              type="button"
              onClick={() => setOverlay(null)}
              style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
            >
              close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
