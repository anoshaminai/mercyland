import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import videoUrl from '../../assets/video/void.mp4?url';

const DISTANCE = 20;

export const VoidVideoBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();

  const texture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: 'anonymous',
    start: true,
  });

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  const { planeWidth, planeHeight } = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const viewportH = 2 * Math.tan(vFov / 2) * DISTANCE;
    const viewportAspect = size.width / size.height;
    const viewportW = viewportH * viewportAspect;

    const videoAspect =
      texture.image && texture.image.videoWidth
        ? texture.image.videoWidth / texture.image.videoHeight
        : 16 / 9;

    let w = viewportW;
    let h = viewportH;
    if (videoAspect > viewportAspect) {
      w = viewportH * videoAspect;
    } else {
      h = viewportW / videoAspect;
    }
    return { planeWidth: w, planeHeight: h };
  }, [camera, size, texture]);

  const forward = useRef(new THREE.Vector3());
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    camera.getWorldDirection(forward.current);
    mesh.position.copy(camera.position).addScaledVector(forward.current, DISTANCE);
    mesh.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh
      ref={meshRef}
      renderOrder={-1000}
      frustumCulled={false}
      scale={[planeWidth, planeHeight, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};
