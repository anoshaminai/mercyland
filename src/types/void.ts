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
