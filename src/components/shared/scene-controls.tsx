import { OrbitControls, Environment } from '@react-three/drei';

export const SceneControls = ({ autoRotate = true }: { autoRotate?: boolean }) => {
  return (
    <>
      <color attach="background" args={['#05080c']} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} color="#c8d8e8" />
      <pointLight position={[-4, 2, -3]} intensity={1.5} color="#b88968" />

      <Environment preset="night" />

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
