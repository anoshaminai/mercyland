import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = ""
}) => (
  <div className={`grid grid-cols-1 gap-16 items-center justify-items-center ${className}`}>
    {children}
  </div>
);
export default Container;