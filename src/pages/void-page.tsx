import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { SceneControls } from '../components/shared/scene-controls';
import { ScatteredObjects } from '../components/shared/scattered-objects';
import { MODEL_URLS, MODELS_BY_NAME } from '../components/shared/model-manifest';
import { VoidPostFX } from '../components/shared/void-post-fx';
import { voidObjects } from '../data/void-objects';
import { VoidNav } from '../components/VoidNav';
import { ObjectDetail } from '../components/void/object-detail';
import { LoadingOverlay } from '../components/void/loading-overlay';
import type { VoidObject } from '../types/void';

export const VoidPage = () => {
  const [selected, setSelected] = useState<VoidObject | null>(null);
  const navigate = useNavigate();

  const objectsById = useMemo(
    () => new Map(voidObjects.map((o) => [o.id, o])),
    [],
  );

  const handleObjectClick = useCallback(
    (id: string) => {
      const obj = objectsById.get(id);
      if (!obj) return;
      if (obj.content.type === 'link') {
        if (obj.content.url.startsWith('/')) {
          navigate(obj.content.url);
        } else {
          window.open(obj.content.url, '_blank');
        }
      } else {
        setSelected(obj);
      }
    },
    [objectsById, navigate],
  );

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: '#1a1a2e' }}>
      <VoidNav />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <SceneControls autoRotate={!selected} />
        <ScatteredObjects
          items={voidObjects}
          models={MODEL_URLS}
          radius={[3, 11]}
          seed={42}
          onObjectClick={handleObjectClick}
          resolveModel={(item) => (item.model ? MODELS_BY_NAME[item.model] : undefined)}
        />
        <VoidPostFX />
      </Canvas>
      <LoadingOverlay />
      <AnimatePresence>
        {selected && (
          <ObjectDetail content={selected.content} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
