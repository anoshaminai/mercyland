import type { VoidObject } from '../types/void';

const touchingSrc = new URL('../assets/images/band/parking lot touching.jpg', import.meta.url).href;

export const chatMessages: VoidObject[] = [
  {
    id: 'note-welcome',
    content: {
      type: 'text',
      title: 'hello',
      body: "you're in. thanks for coming. messages will appear here — new ones every so often. keep it secret, keep it safe.",
    },
  },
  {
    id: 'note-image',
    content: {
      type: 'image',
      src: touchingSrc,
      alt: 'a photo for you',
    },
  },
  {
    id: 'note-video',
    content: {
      type: 'video',
      youtubeId: 'dQw4w9WgXcQ',
      title: 'for your ears only',
    },
  },
];
