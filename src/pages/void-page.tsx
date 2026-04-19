import { Suspense, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { SceneControls } from '../components/shared/scene-controls';
import { ScatteredObjects } from '../components/shared/scattered-objects';
import { MODEL_URLS } from '../components/shared/model-manifest';
import { VoidPostFX } from '../components/shared/void-post-fx';
import { voidObjects } from '../data/void-objects';
import { VoidNav } from '../components/VoidNav';
import { ObjectDetail } from '../components/void/object-detail';
import type { VoidObject } from '../types/void';

export const VoidPage = () => {
  const [selected, setSelected] = useState<VoidObject | null>(null);

  const objectsById = useMemo(
    () => new Map(voidObjects.map((o) => [o.id, o])),
    [],
  );

  const handleObjectClick = useCallback(
    (id: string) => {
      const obj = objectsById.get(id);
      if (!obj) return;
      if (obj.content.type === 'link') {
        window.open(obj.content.url, '_blank');
      } else {
        setSelected(obj);
      }
    },
    [objectsById],
  );

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: '#1a1a2e' }}>
      <VoidNav />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <SceneControls autoRotate={!selected} />
        <Suspense fallback={null}>
          <ScatteredObjects
            items={voidObjects}
            models={MODEL_URLS}
            radius={[3, 11]}
            seed={42}
            onObjectClick={handleObjectClick}
          />
        </Suspense>
        <VoidPostFX />
      </Canvas>
      <AnimatePresence>
        {selected && (
          <ObjectDetail content={selected.content} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
