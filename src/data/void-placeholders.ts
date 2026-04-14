import type { FloatingObjectConfig, GeometryType } from '../types/void';

const MERCY_COLORS = ['#B71B02', '#00EA2D', '#062898', '#CE2CB8', '#FFFFFF'];
const GEOMETRIES: GeometryType[] = ['box', 'sphere', 'octahedron', 'torus', 'icosahedron'];

// Simple seeded random for deterministic-feeling generation
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generatePlaceholders(count = 12): FloatingObjectConfig[] {
  const rand = seededRandom(42);
  const objects: FloatingObjectConfig[] = [];

  for (let i = 0; i < count; i++) {
    objects.push({
      id: `placeholder-${i}`,
      position: [
        (rand() - 0.5) * 20,
        (rand() - 0.5) * 14,
        (rand() - 0.5) * 20,
      ],
      scale: 0.3 + rand() * 1.2,
      geometry: GEOMETRIES[Math.floor(rand() * GEOMETRIES.length)],
      color: MERCY_COLORS[Math.floor(rand() * MERCY_COLORS.length)],
      drift: {
        speed: 0.2 + rand() * 0.4,
        amplitude: 1 + rand() * 2,
        phaseOffset: rand() * Math.PI * 2,
      },
      rotationSpeed: [
        0.05 + rand() * 0.25,
        0.05 + rand() * 0.25,
        0.05 + rand() * 0.25,
      ],
    });
  }

  return objects;
}
