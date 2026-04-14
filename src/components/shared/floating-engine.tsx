import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, MathUtils, MeshStandardMaterial } from 'three';
import type { FloatingObjectConfig } from '../../types/void';
import { ClickableObject } from './clickable-object';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

const GeometryByType = {
  box: <boxGeometry />,
  sphere: <sphereGeometry args={[1, 24, 24]} />,
  octahedron: <octahedronGeometry />,
  torus: <torusGeometry args={[1, 0.4, 16, 32]} />,
  icosahedron: <icosahedronGeometry />,
};

const FloatingMesh = ({ config, onObjectClick }: { config: FloatingObjectConfig; onObjectClick?: (id: string) => void }) => {
  const meshRef = useRef<Mesh>(null!);
  const hovered = useRef(false);
  const hoverScale = useRef(1);
  const { camera } = useThree();
  const [ix, iy, iz] = config.position;
  const { speed, amplitude, phaseOffset } = config.drift;

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const mesh = meshRef.current;

    mesh.position.x = ix + Math.sin(t * speed * 1.0 + phaseOffset) * amplitude;
    mesh.position.y = iy + Math.cos(t * speed * 0.7 + phaseOffset + 1.3) * amplitude * 0.8;
    mesh.position.z = iz + Math.sin(t * speed * 0.5 + phaseOffset + 2.7) * amplitude * 0.6;

    mesh.rotation.x += config.rotationSpeed[0] * delta;
    mesh.rotation.y += config.rotationSpeed[1] * delta;
    mesh.rotation.z += config.rotationSpeed[2] * delta;

    const target = hovered.current ? 1.15 : 1.0;
    hoverScale.current = MathUtils.lerp(hoverScale.current, target, 0.1);
    const s = config.scale * hoverScale.current;
    mesh.scale.set(s, s, s);

    const dist = camera.position.distanceTo(mesh.position);
    const opacity = 1 - smoothstep(8, 30, dist);
    const mat = mesh.material as MeshStandardMaterial;
    mat.opacity = opacity;
  });

  return (
    <ClickableObject hovered={hovered} onClick={() => onObjectClick?.(config.id)}>
      <mesh ref={meshRef}>
        {GeometryByType[config.geometry]}
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.3}
          transparent
        />
      </mesh>
    </ClickableObject>
  );
};

export const FloatingEngine = ({ objects, onObjectClick }: { objects: FloatingObjectConfig[]; onObjectClick?: (id: string) => void }) => {
  return (
    <>
      {objects.map((obj) => (
        <FloatingMesh key={obj.id} config={obj} onObjectClick={onObjectClick} />
      ))}
    </>
  );
};
