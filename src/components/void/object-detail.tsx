import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { VoidContent } from '../../types/void';

interface ObjectDetailProps {
  content: VoidContent;
  onClose: () => void;
}

export const ObjectDetail = ({ content, onClose }: ObjectDetailProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/70 hover:text-white text-3xl font-mono cursor-pointer"
      >
        ✕
      </button>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content.type === 'music' && <MusicDetail content={content} />}
        {content.type === 'video' && <VideoDetail content={content} />}
        {content.type === 'image' && <ImageDetail content={content} />}
      </motion.div>
    </motion.div>
  );
};

function MusicDetail({ content }: { content: Extract<VoidContent, { type: 'music' }> }) {
  return (
    <>
      <img
        src={content.albumArt}
        alt={content.title}
        className="w-[200px] h-[200px] object-cover"
      />
      <h2 className="text-white font-mono text-lg">{content.title}</h2>
      <iframe
        src={content.embedUrl}
        className="w-[280px] h-[100px] border-0"
        seamless
        title={content.title}
      />
    </>
  );
}

function VideoDetail({ content }: { content: Extract<VoidContent, { type: 'video' }> }) {
  return (
    <>
      <h2 className="text-white font-mono text-lg">{content.title}</h2>
      <div className="relative w-[min(56vh,90vw)] aspect-[9/16]">
        <iframe
          src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={content.title}
        />
      </div>
    </>
  );
}

function ImageDetail({ content }: { content: Extract<VoidContent, { type: 'image' }> }) {
  return (
    <img
      src={content.src}
      alt={content.alt}
      className="max-h-[80vh] max-w-[90vw] object-contain"
    />
  );
}
