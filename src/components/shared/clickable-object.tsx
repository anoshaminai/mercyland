interface ClickableObjectProps {
  children: React.ReactNode;
  hovered: React.MutableRefObject<boolean>;
  onClick?: () => void;
}

export const ClickableObject = ({ children, hovered, onClick }: ClickableObjectProps) => {
  return (
    <group
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
