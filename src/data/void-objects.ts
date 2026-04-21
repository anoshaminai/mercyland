import type { VoidObject } from '../types/void';
import { songs } from './media';
import { videos } from './videos';

const logoSrc = new URL('../assets/images/temp_logo.png', import.meta.url).href;
const chatWorldLogoSrc = new URL('../assets/images/chat_world/chatworld-logo.png', import.meta.url).href;

export const voidObjects: VoidObject[] = [
  {
    id: 'get-lost',
    content: {
      type: 'music',
      albumArt: songs[1].albumArt!,
      embedUrl: songs[1].bandcampEmbed!,
      title: songs[1].title,
    },
  },
  {
    id: 'when-the-lights',
    content: {
      type: 'music',
      albumArt: songs[2].albumArt!,
      embedUrl: songs[2].bandcampEmbed!,
      title: songs[2].title,
    },
  },
  {
    id: 'route-42',
    content: {
      type: 'music',
      albumArt: songs[3].albumArt!,
      embedUrl: songs[3].bandcampEmbed!,
      title: songs[3].title,
    },
  },
  {
    id: 'termites-ep1',
    content: {
      type: 'video',
      youtubeId: videos[0].youtubeId,
      title: `${videos[0].episode} — ${videos[0].title}`,
    },
  },
  {
    id: 'termites-ep2',
    content: {
      type: 'video',
      youtubeId: videos[1].youtubeId,
      title: `${videos[1].episode} — ${videos[1].title}`,
    },
  },
  {
    id: 'logo',
    clickable: false,
    content: {
      type: 'image',
      src: logoSrc,
      alt: 'Mercy Land logo',
    },
  },
  {
    id: 'bandcamp',
    content: {
      type: 'link',
      label: 'Bandcamp',
      url: 'https://mercyland.bandcamp.com',
    },
  },
  {
    id: 'chat-world-entry',
    planeSrc: chatWorldLogoSrc,
    content: {
      type: 'link',
      label: 'chat world',
      url: '/gate',
    },
  },
];
