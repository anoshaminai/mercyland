import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneControls } from '../components/shared/scene-controls';
import { FloatingEngine } from '../components/shared/floating-engine';
import { generatePlaceholders } from '../data/void-placeholders';
import { VoidNav } from '../components/VoidNav';

export const VoidPage = () => {
  const objects = useMemo(() => generatePlaceholders(12), []);

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: '#1a1a2e' }}>
      <VoidNav />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <SceneControls />
        <FloatingEngine objects={objects} />
      </Canvas>
    </div>
  );
};
