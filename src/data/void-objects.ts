import type { VoidObject } from '../types/void';
import { MERCH_URL } from './links';

const termitesArt = new URL('../assets/images/cover art/Termites cover art.jpg', import.meta.url).href;
const kidAArt = new URL('../assets/images/cover art/Kid A cover art.jpg', import.meta.url).href;
const getLostArt = new URL('../assets/images/cover art/Get Lost cover art.jpg', import.meta.url).href;
const wtlgo = new URL('../assets/images/cover art/wtlgo cover art.jpg', import.meta.url).href;
const route42Art = new URL('../assets/images/cover art/Rt42 cover art.jpg', import.meta.url).href;

const chatWorldLogoSrc = new URL('../assets/images/chat_world/chatworld-logo.png', import.meta.url).href;
const runSrc = new URL('../assets/images/band/parking lot wide run.jpg', import.meta.url).href;
const stairsSrc = new URL('../assets/images/band/stairs vertical 1.jpg', import.meta.url).href;

// `model` pins a specific .glb (bare filename, no extension) to this object.
// Objects without `model` get any leftover .glb shuffled in from the pool.
const CHAT_WORLD_ENABLED = import.meta.env.VITE_CHAT_WORLD_ENABLED !== 'false';

const allVoidObjects: VoidObject[] = [
  {
    id: 'kid-a',
    content: {
      type: 'music',
      albumArt: kidAArt,
      embedUrl:
        'https://bandcamp.com/EmbeddedPlayer/track=1301656413/size=small/bgcol=333333/linkcol=e32c14/artwork=none/transparent=true/',
      title: 'Kid A',
    },
    model: 'tooth',
  },
  {
    id: 'get-lost',
    content: {
      type: 'music',
      albumArt: getLostArt,
      embedUrl:
        'https://bandcamp.com/EmbeddedPlayer/track=2691189257/size=small/bgcol=333333/linkcol=e32c14/artwork=none/transparent=true/',
      title: 'Get Lost',
    },
    model: 'tooth',
  },
    {
    id: 'wtlgo',
    content: {
      type: 'music',
      albumArt: wtlgo,
      embedUrl:
        'https://bandcamp.com/EmbeddedPlayer/track=2373043130/size=small/bgcol=333333/linkcol=e32c14/artwork=none/transparent=true/',
      title: 'When The Lights',
    },
    model: 'tooth',
  },
    {
    id: 'route-42',
    content: {
      type: 'music',
      albumArt: route42Art,
      embedUrl:
        'https://bandcamp.com/EmbeddedPlayer/track=290819177/size=small/bgcol=333333/linkcol=e32c14/artwork=none/transparent=true/',
      title: 'Route 42',
    },
    model: 'tooth',
  },
    {
    id: 'termites',
    content: {
      type: 'music',
      albumArt: termitesArt,
      embedUrl:
        'https://bandcamp.com/EmbeddedPlayer/album=2609233688/size=small/bgcol=333333/linkcol=e32c14/artwork=none/transparent=true/',
      title: 'Termites EP',
    },
    model: 'tooth',
  },
  {
    id: 'termites-ep1',
    content: {
      type: 'video',
      youtubeId: 'u-QkMqxZWs0',
      title: 'EPISODE 1 — Kid A',
    },
    model: 'cake'
  },
  {
    id: 'termites-ep2',
    content: {
      type: 'video',
      youtubeId: '3iTGqtmzLiI',
      title: 'EPISODE 2 — Get Lost!',
    },
  },
  {
    id: 'termites-ep3',
    content: {
      type: 'video',
      youtubeId: 'G30WCXV8qbE',
      title: 'EPISODE 3 — When the Lights',
    },
    model: 'cake'
  },
  {
    id: 'termites-ep4',
    content: {
      type: 'video',
      youtubeId: 'OrYCAoi-YGI',
      title: 'EPISODE 4 — Route 42',
    },
  },
  {
    id: 'termites-ep5',
    content: {
      type: 'video',
      youtubeId: 'x_D43YjEvy4',
      title: 'EPISODE 5 — Termites',
    },
    model: 'cake'
  },
  {
    id: 'control',
    content: {
      type: 'video',
      youtubeId: '4zTHoXF3_Uc',
      title: 'Control Remix',
    },
  },
  {
    id: 'bandcamp',
    content: {
      type: 'link',
      label: 'Bandcamp',
      url: 'https://thankgodformercyland.bandcamp.com',
    },
  },
  {
    id: 'run',
    content: {
      type: 'image',
      src: runSrc,
      alt: 'run run run',
    },
  },
  {
    id: 'stairs',
    content: {
      type: 'image',
      src: stairsSrc,
      alt: 'look up',
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
  {
    id: 'merch',
    content: {
      type: 'link',
      label: 'Merch',
      url: MERCH_URL,
    },
    model: 'cardboardBox',
  },
];

export const voidObjects: VoidObject[] = CHAT_WORLD_ENABLED
  ? allVoidObjects
  : allVoidObjects.filter((o) => o.id !== 'chat-world-entry');

