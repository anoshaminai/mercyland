import { Suspense } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { VoidVideoBackground } from './void-video-background';
import { ScatteredObjects } from './scattered-objects';
import { MODEL_URLS } from './model-manifest';

export const SceneControls = ({ autoRotate = true }: { autoRotate?: boolean }) => {
  return (
    <>
      <color attach="background" args={['#05080c']} />

      <Suspense fallback={null}>
        <VoidVideoBackground />
      </Suspense>

      <ambientLight intensity={0.35} color="#d8e0ea" />
      <directionalLight position={[5, 8, 3]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, 2, -3]} intensity={0.6} color="#b88968" />
      <pointLight position={[0, -3, 4]} intensity={0.4} color="#8faac4" />

      <Environment preset="studio" environmentIntensity={0.3} />

      <Suspense fallback={null}>
        <ScatteredObjects count={12} models={MODEL_URLS} radius={[3, 11]} seed={42} />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.3}
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
};
