interface ClickableObjectProps {
  children: React.ReactNode;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

const TAP_MOVE_THRESHOLD = 5;

export const ClickableObject = ({ children, onClick, onHoverChange }: ClickableObjectProps) => {
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverChange?.(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHoverChange?.(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < TAP_MOVE_THRESHOLD) onClick?.();
      }}
    >
      {children}
    </group>
  );
};
