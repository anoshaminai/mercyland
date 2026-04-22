import type { VoidObject } from '../types/void';

const touchingSrc = new URL('../assets/images/band/parking lot touching.jpg', import.meta.url).href;

export const chatMessages: VoidObject[] = [
  {
    id: 'note-welcome',
    content: {
      type: 'text',
      title: 'Hi!',
      body: "i did it all for you <3 i wrote this song for you <3",
    },
  },
  {
    id: 'note-image',
    content: {
      type: 'image',
      src: touchingSrc,
      alt: 'when it all turned blue',
    },
  },
  {
    id: 'note-video',
    content: {
      type: 'video',
      youtubeId: 'bbNxduOX9U4',
      title: 'April 30',
    },
  },
];
