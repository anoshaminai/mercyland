import { OrbitControls } from '@react-three/drei';

export const SceneControls = () => {
  return (
    <>
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 10, 35]} />

      <ambientLight intensity={0.4} />
      <pointLight color="#CE2CB8" position={[10, 8, 10]} intensity={80} />
      <pointLight color="#062898" position={[-10, -5, -10]} intensity={80} />
      <pointLight color="#B71B02" position={[0, 10, -8]} intensity={80} />

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
