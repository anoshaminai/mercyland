type Props = {
  label: string;
  aspect?: string;
  className?: string;
};

export const PlaceholderBox = ({ label, aspect = '4 / 3', className = '' }: Props) => (
  <div
    className={`w-full border-2 border-dashed border-mercy-red/60 flex items-center justify-center text-mercy-red/80 font-primary text-sm uppercase tracking-wider ${className}`}
    style={{ aspectRatio: aspect }}
  >
    {label} — TBD
  </div>
);
