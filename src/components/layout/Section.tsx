import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = "", 
  background = "bg-mercy-olive"
}) => (
  <section className={`min-h-screen ${background} pt-8 pb-16 ${className}`}>
    <div className="max-w-content mx-auto px-4">
      {children}
    </div>
  </section>
);
export default Section;