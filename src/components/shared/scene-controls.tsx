import { OrbitControls } from '@react-three/drei';

export const SceneControls = () => {
  return (
    <>
      <color attach="background" args={['#000102']} />
      <fog attach="fog" args={['#000102', 8, 30]} />

      <ambientLight intensity={0.15} />
      <pointLight color="#CE2CB8" position={[10, 8, 10]} intensity={1.5} distance={40} />
      <pointLight color="#062898" position={[-10, -5, -10]} intensity={1.5} distance={40} />
      <pointLight color="#B71B02" position={[0, 10, -8]} intensity={1.5} distance={40} />

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
