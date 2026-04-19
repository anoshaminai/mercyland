import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { normalizeObj } from '../../lib/normalize-obj';

type FloatingObjProps = {
  src: string;
  position?: [number, number, number];
  scale?: number;
  initialRotation?: [number, number, number];
  float?: { amplitude: number; speed: number; phaseOffset: number };
  spin?: { axis: 'x' | 'y' | 'z'; speed: number };
};

export const FloatingObj = ({
  src,
  position = [0, 0, 0],
  scale = 1,
  initialRotation = [0, 0, 0],
  float = { amplitude: 0.3, speed: 0.4, phaseOffset: 0 },
  spin = { axis: 'y', speed: 0.15 },
}: FloatingObjProps) => {
  const { scene } = useGLTF(src);

  const group = useMemo(() => {
    const cloned = scene.clone(true);
    normalizeObj(cloned);
    return cloned;
  }, [scene]);

  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.rotation.set(...initialRotation);
  }, [initialRotation]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.position.y = baseY + Math.sin(t * float.speed + float.phaseOffset) * float.amplitude;
    mesh.rotation[spin.axis] += delta * spin.speed;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={group} />
    </group>
  );
};
