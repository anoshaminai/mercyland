import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { normalizeObj } from '../../lib/normalize-obj';
import { ClickableObject } from './clickable-object';

type FloatingObjProps = {
  src: string;
  position?: [number, number, number];
  scale?: number;
  initialRotation?: [number, number, number];
  float?: { amplitude: number; speed: number; phaseOffset: number };
  spin?: { axis: 'x' | 'y' | 'z'; speed: number };
  onClick?: () => void;
};

const SETTLE_EPSILON = 0.001;

export const FloatingObj = ({
  src,
  position = [0, 0, 0],
  scale = 1,
  initialRotation = [0, 0, 0],
  float = { amplitude: 0.3, speed: 0.4, phaseOffset: 0 },
  spin = { axis: 'y', speed: 0.15 },
  onClick,
}: FloatingObjProps) => {
  const { scene } = useGLTF(src);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    normalizeObj(c);
    return c;
  }, [scene]);

  const ref = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const hoverScale = useRef(1);
  const baseY = position[1];

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.position.y = baseY + Math.sin(t * float.speed + float.phaseOffset) * float.amplitude;
    mesh.rotation[spin.axis] += delta * spin.speed;

    const target = hovered.current ? 1.15 : 1.0;
    if (Math.abs(hoverScale.current - target) > SETTLE_EPSILON) {
      hoverScale.current = THREE.MathUtils.lerp(hoverScale.current, target, 0.1);
      const s = scale * hoverScale.current;
      mesh.scale.set(s, s, s);
    }
  });

  const body = (
    <group ref={ref} position={position} rotation={initialRotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  );

  if (!onClick) return body;

  return (
    <ClickableObject onClick={onClick} onHoverChange={(h) => (hovered.current = h)}>
      {body}
    </ClickableObject>
  );
};
