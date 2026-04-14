import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { MathUtils } from 'three';

interface ClickableObjectProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ClickableObject = ({ children, onClick }: ClickableObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const hovered = useRef(false);
  const currentScale = useRef(1);

  useFrame(() => {
    const target = hovered.current ? 1.15 : 1.0;
    currentScale.current = MathUtils.lerp(currentScale.current, target, 0.1);
    groupRef.current.scale.setScalar(currentScale.current);
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
    </group>
  );
};
