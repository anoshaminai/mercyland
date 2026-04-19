import type { ReactNode } from 'react';

type Props = {
  id?: string;
  className?: string;
  bg?: string;
  children: ReactNode;
};

export const FlatSection = ({ id, className = '', bg = 'bg-mercy-black', children }: Props) => (
  <section id={id} className={`${bg} px-6 ${className || 'py-24'}`}>
    {children}
  </section>
);
