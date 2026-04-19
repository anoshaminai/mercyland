import type { ReactNode } from 'react';

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export const FlatSection = ({ id, className = '', children }: Props) => (
  <section id={id} className={`bg-mercy-black px-6 ${className || 'py-24'}`}>
    {children}
  </section>
);
