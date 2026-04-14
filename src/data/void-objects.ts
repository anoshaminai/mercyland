import type { VoidObject } from '../types/void';
import { songs } from './media';
import { videos } from './videos';

const logoSrc = new URL('../assets/images/temp_logo.png', import.meta.url).href;

export const voidObjects: VoidObject[] = [
  {
    id: 'get-lost',
    position: [-6, 3, -4],
    scale: 1.2,
    geometry: 'sphere',
    color: '#00EA2D',
    drift: { speed: 0.4, amplitude: 2.5, phaseOffset: 0 },
    rotationSpeed: [0.15, 0.2, 0.05],
    content: {
      type: 'music',
      albumArt: songs[1].albumArt!,
      embedUrl: songs[1].bandcampEmbed!,
      title: songs[1].title,
    },
  },
  {
    id: 'when-the-lights',
    position: [5, -2, 3],
    scale: 1.0,
    geometry: 'octahedron',
    color: '#CE2CB8',
    drift: { speed: 0.35, amplitude: 2.0, phaseOffset: 1.5 },
    rotationSpeed: [0.1, 0.25, 0.1],
    content: {
      type: 'music',
      albumArt: songs[2].albumArt!,
      embedUrl: songs[2].bandcampEmbed!,
      title: songs[2].title,
    },
  },
  {
    id: 'route-42',
    position: [2, 5, -6],
    scale: 1.1,
    geometry: 'icosahedron',
    color: '#B71B02',
    drift: { speed: 0.3, amplitude: 3.0, phaseOffset: 3.0 },
    rotationSpeed: [0.2, 0.1, 0.15],
    content: {
      type: 'music',
      albumArt: songs[3].albumArt!,
      embedUrl: songs[3].bandcampEmbed!,
      title: songs[3].title,
    },
  },
  {
    id: 'termites-ep1',
    position: [-4, -4, 5],
    scale: 1.3,
    geometry: 'box',
    color: '#062898',
    drift: { speed: 0.25, amplitude: 2.8, phaseOffset: 4.5 },
    rotationSpeed: [0.12, 0.18, 0.08],
    content: {
      type: 'video',
      youtubeId: videos[0].youtubeId,
      title: `${videos[0].episode} — ${videos[0].title}`,
    },
  },
  {
    id: 'termites-ep2',
    position: [7, 1, -2],
    scale: 0.9,
    geometry: 'torus',
    color: '#FFFFFF',
    drift: { speed: 0.45, amplitude: 2.2, phaseOffset: 6.0 },
    rotationSpeed: [0.08, 0.22, 0.12],
    content: {
      type: 'video',
      youtubeId: videos[1].youtubeId,
      title: `${videos[1].episode} — ${videos[1].title}`,
    },
  },
  {
    id: 'logo',
    position: [0, 0, -8],
    scale: 1.4,
    geometry: 'sphere',
    color: '#FFFFFF',
    drift: { speed: 0.2, amplitude: 1.5, phaseOffset: 2.0 },
    rotationSpeed: [0.05, 0.1, 0.05],
    content: {
      type: 'image',
      src: logoSrc,
      alt: 'Mercy Land logo',
    },
  },
  {
    id: 'bandcamp',
    position: [-3, 2, 7],
    scale: 0.8,
    geometry: 'box',
    color: '#00EA2D',
    drift: { speed: 0.5, amplitude: 2.0, phaseOffset: 5.0 },
    rotationSpeed: [0.18, 0.15, 0.1],
    content: {
      type: 'link',
      label: 'Bandcamp',
      url: 'https://mercyland.bandcamp.com',
    },
  },
];
