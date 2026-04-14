export type GeometryType = 'box' | 'sphere' | 'octahedron' | 'torus' | 'icosahedron';

export interface FloatingObjectConfig {
  id: string;
  position: [number, number, number];
  scale: number;
  geometry: GeometryType;
  color: string;
  drift: { speed: number; amplitude: number; phaseOffset: number };
  rotationSpeed: [number, number, number];
}

export type VoidContent =
  | { type: 'image'; src: string; alt: string }
  | { type: 'music'; albumArt: string; embedUrl: string; title: string }
  | { type: 'video'; youtubeId: string; title: string }
  | { type: 'link'; label: string; url: string };

export interface VoidObject extends FloatingObjectConfig {
  content: VoidContent;
}
