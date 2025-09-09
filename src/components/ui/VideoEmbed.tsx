interface VideoEmbedProps {
  src: string;
  className?: string;
  title?: string;
  aspectRatio?: '16/9' | '9/16' | '4/3' | '1/1';
  maxWidth?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  src, 
  className = "",
  title = "Embedded video",
  aspectRatio = '9/16',
  maxWidth = '400px'
}) => {
  const aspectClasses = {
    '16/9': 'aspect-video',
    '9/16': 'aspect-[9/16]',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square'
  };

  return (
    <div 
      className={`w-full ${aspectClasses[aspectRatio]} ${className}`}
      style={{ maxWidth }}
    >
      <iframe 
        className="w-full h-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
export default VideoEmbed;
