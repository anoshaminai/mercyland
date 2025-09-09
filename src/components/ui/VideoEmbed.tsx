interface VideoEmbedProps {
  src: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  src, 
  className = ""
}) => (
  <div className={`w-full max-w-[400px] aspect-[9/16] ${className}`}>
    <iframe 
      className="w-full h-full"
      src={src}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

