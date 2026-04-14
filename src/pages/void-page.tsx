import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { SceneControls } from '../components/shared/scene-controls';
import { FloatingEngine } from '../components/shared/floating-engine';
import { voidObjects } from '../data/void-objects';
import { VoidNav } from '../components/VoidNav';
import { ObjectDetail } from '../components/void/object-detail';
import type { VoidObject } from '../types/void';

export const VoidPage = () => {
  const [selected, setSelected] = useState<VoidObject | null>(null);

  const handleObjectClick = (id: string) => {
    const obj = voidObjects.find((o) => o.id === id);
    if (obj?.content.type === 'link') {
      window.open(obj.content.url, '_blank');
    } else if (obj) {
      setSelected(obj);
    }
  };

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: '#1a1a2e' }}>
      <VoidNav />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <SceneControls autoRotate={!selected} />
        <FloatingEngine objects={voidObjects} onObjectClick={handleObjectClick} />
      </Canvas>
      <AnimatePresence>
        {selected && (
          <ObjectDetail content={selected.content} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
