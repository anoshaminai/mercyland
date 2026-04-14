import { OrbitControls } from '@react-three/drei';

export const SceneControls = () => {
  return (
    <>
      <color attach="background" args={['#6c6c7a']} />
      <fog attach="fog" args={['#e7e7f2', 10, 35]} />

      <ambientLight intensity={0.7} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minDistance={3}
        maxDistance={25}
      />
    </>
  );
};
