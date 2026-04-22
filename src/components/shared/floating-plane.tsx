import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { ClickableObject } from './clickable-object';

type FloatingPlaneProps = {
  src: string;
  position?: [number, number, number];
  scale?: number;
  float?: { amplitude: number; speed: number; phaseOffset: number };
  billboard?: boolean;
  onClick?: () => void;
};

const SETTLE_EPSILON = 0.001;
const FADE_DURATION = 0.6;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const FloatingPlane = ({
  src,
  position = [0, 0, 0],
  scale = 1,
  float = { amplitude: 0.3, speed: 0.4, phaseOffset: 0 },
  billboard = true,
  onClick,
}: FloatingPlaneProps) => {
  const texture = useLoader(THREE.TextureLoader, src);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  const aspect = useMemo(() => {
    const img = texture.image as HTMLImageElement | undefined;
    if (!img || !img.width || !img.height) return 1;
    return img.width / img.height;
  }, [texture]);

  const ref = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const hovered = useRef(false);
  const hoverScale = useRef(1);
  const fadeElapsed = useRef(0);
  const fadeDone = useRef(false);
  const baseY = position[1];

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;

    if (!fadeDone.current && materialRef.current) {
      fadeElapsed.current += delta;
      const progress = Math.min(fadeElapsed.current / FADE_DURATION, 1);
      materialRef.current.opacity = easeOutCubic(progress);
      if (progress >= 1) {
        materialRef.current.opacity = 1;
        fadeDone.current = true;
      }
    }

    const t = state.clock.elapsedTime;
    group.position.y = baseY + Math.sin(t * float.speed + float.phaseOffset) * float.amplitude;

    if (billboard) group.quaternion.copy(state.camera.quaternion);

    const target = hovered.current ? 1.15 : 1.0;
    if (Math.abs(hoverScale.current - target) > SETTLE_EPSILON) {
      hoverScale.current = THREE.MathUtils.lerp(hoverScale.current, target, 0.1);
      const s = scale * hoverScale.current;
      group.scale.set(s, s, s);
    }
  });

  const body = (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[aspect, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
          alphaTest={0.01}
        />
      </mesh>
    </group>
  );

  if (!onClick) return body;

  return (
    <ClickableObject onClick={onClick} onHoverChange={(h) => (hovered.current = h)}>
      {body}
    </ClickableObject>
  );
};
