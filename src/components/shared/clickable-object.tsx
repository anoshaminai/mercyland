import { useRef } from 'react';
import { Vector2 } from 'three';

interface ClickableObjectProps {
  children: React.ReactNode;
  hovered: React.MutableRefObject<boolean>;
  onClick?: () => void;
}

const TAP_MOVE_THRESHOLD = 5; // pixels

export const ClickableObject = ({ children, hovered, onClick }: ClickableObjectProps) => {
  const pointerDownPos = useRef<Vector2 | null>(null);

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = 'auto';
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        pointerDownPos.current = new Vector2(e.clientX, e.clientY);
        hovered.current = true;
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (pointerDownPos.current) {
          const dist = pointerDownPos.current.distanceTo(new Vector2(e.clientX, e.clientY));
          if (dist < TAP_MOVE_THRESHOLD) {
            onClick?.();
          }
        }
        pointerDownPos.current = null;
        hovered.current = false;
      }}
      onPointerCancel={() => {
        pointerDownPos.current = null;
        hovered.current = false;
      }}
    >
      {children}
    </group>
  );
};
