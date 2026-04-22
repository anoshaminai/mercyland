import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { VoidContent } from '../../types/void';

interface ChatMessageDetailProps {
  content: VoidContent;
  onClose: () => void;
}

export const ChatMessageDetail = ({ content, onClose }: ChatMessageDetailProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-mercy-pink hover:text-mercy-white text-3xl font-mono cursor-pointer"
        aria-label="close"
      >
        ✕
      </button>

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChatBubble>
          {content.type === 'text' && <TextBody content={content} />}
          {content.type === 'image' && <ImageBody content={content} />}
          {content.type === 'video' && <VideoBody content={content} />}
          {content.type === 'music' && <MusicBody content={content} />}
        </ChatBubble>
      </motion.div>
    </motion.div>
  );
};

function ChatBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-[min(560px,90vw)]">
      <div
        className="relative bg-mercy-green text-mercy-black font-primary px-6 py-5 rounded-2xl"
        style={{ border: '4px solid var(--color-mercy-pink)' }}
      >
        {children}
        <span
          aria-hidden
          className="absolute"
          style={{
            left: '38px',
            bottom: '-22px',
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '22px solid var(--color-mercy-pink)',
          }}
        />
        <span
          aria-hidden
          className="absolute"
          style={{
            left: '43px',
            bottom: '-13px',
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderTop: '15px solid var(--color-mercy-green)',
          }}
        />
      </div>
    </div>
  );
}

function TextBody({ content }: { content: Extract<VoidContent, { type: 'text' }> }) {
  return (
    <div className="flex flex-col gap-2">
      {content.title && (
        <h2 className="text-mercy-black font-primary text-base opacity-80">{content.title}</h2>
      )}
      <p className="text-mercy-black font-primary text-lg leading-relaxed whitespace-pre-wrap">
        {content.body}
      </p>
    </div>
  );
}

function ImageBody({ content }: { content: Extract<VoidContent, { type: 'image' }> }) {
  return (
    <img
      src={content.src}
      alt={content.alt}
      className="block max-h-[70vh] max-w-full object-contain rounded"
    />
  );
}

function VideoBody({ content }: { content: Extract<VoidContent, { type: 'video' }> }) {
  return (
    <div className="flex flex-col gap-3">
      {content.title && (
        <h2 className="text-mercy-black font-primary text-base">{content.title}</h2>
      )}
      <div className="relative w-[min(56vh,80vw)] aspect-[9/16] rounded overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${content.youtubeId}?autoplay=1&mute=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={content.title}
        />
      </div>
    </div>
  );
}

function MusicBody({ content }: { content: Extract<VoidContent, { type: 'music' }> }) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <img
        src={content.albumArt}
        alt={content.title}
        className="w-[180px] h-[180px] object-cover rounded"
      />
      <h2 className="text-mercy-black font-primary text-base">{content.title}</h2>
      <iframe
        src={content.embedUrl}
        className="w-[280px] h-[100px] border-0 bg-mercy-white"
        seamless
        title={content.title}
      />
    </div>
  );
}
