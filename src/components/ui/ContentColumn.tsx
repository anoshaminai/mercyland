import { ReactNode } from 'react';

interface ContentColumnProps {
  children: ReactNode;
  className?: string;
  alignment?: 'center' | 'start' | 'end';
}

export const ContentColumn: React.FC<ContentColumnProps> = ({ 
  children, 
  className = "",
  alignment = 'start'
}) => {
  const alignmentClasses = {
    center: 'items-center',
    start: 'items-center md:items-start',
    end: 'items-center md:items-end'
  };

  return (
    <div className={`flex flex-col gap-4 justify-center ${alignmentClasses[alignment]} ${className}`}>
      {children}
    </div>
  );
};
export default ContentColumn; 