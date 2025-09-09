import { ReactNode } from 'react';

interface GridRowProps {
  children: ReactNode;
  className?: string;
}

export const GridRow: React.FC<GridRowProps> = ({ children, className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center w-full ${className}`}>
    {children}
  </div>
);
export default GridRow;