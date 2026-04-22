import { Suspense, useMemo } from 'react';
import { FloatingObj } from './floating-obj';
import { FloatingPlane } from './floating-plane';
import { mulberry32 } from '../../lib/rng';
import type { VoidObject } from '../../types/void';

type ScatteredObjectsProps = {
  items: VoidObject[];
  models: string[];
  radius?: [number, number];
  yRange?: [number, number];
  seed?: number;
  minSpacing?: number;
  onObjectClick?: (id: string) => void;
  resolveModel?: (item: VoidObject) => string | undefined;
};

type Placement = {
  src: string;
  position: [number, number, number];
  scale: number;
  initialRotation: [number, number, number];
  float: { amplitude: number; speed: number; phaseOffset: number };
  spin: { axis: 'x' | 'y' | 'z'; speed: number };
};

const resolveModelUrls = (
  items: VoidObject[],
  models: string[],
  resolveModel: ((item: VoidObject) => string | undefined) | undefined,
  count: number,
  rng: () => number,
): string[] => {
  const pinned: Array<string | undefined> = items.map((item) =>
    resolveModel ? resolveModel(item) : undefined,
  );
  const claimed = new Set(pinned.filter((u): u is string => !!u));
  const pool = models.filter((m) => !claimed.has(m));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  let poolIdx = 0;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const pin = i < pinned.length ? pinned[i] : undefined;
    if (pin) {
      result.push(pin);
    } else if (poolIdx < pool.length) {
      result.push(pool[poolIdx++]);
    } else if (models.length > 0) {
      result.push(models[Math.floor(rng() * models.length)]);
    }
  }
  return result;
};

const generatePlacements = (
  count: number,
  modelUrls: string[],
  radius: [number, number],
  yRange: [number, number],
  rng: () => number,
  minSpacing: number,
): Placement[] => {
  const placements: Placement[] = [];
  const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];

  for (let i = 0; i < count; i++) {
    let position: [number, number, number] | null = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      const angle = rng() * Math.PI * 2;
      const r = radius[0] + rng() * (radius[1] - radius[0]);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = yRange[0] + rng() * (yRange[1] - yRange[0]);
      const candidate: [number, number, number] = [x, y, z];

      const tooClose = placements.some((p) => {
        const dx = p.position[0] - candidate[0];
        const dy = p.position[1] - candidate[1];
        const dz = p.position[2] - candidate[2];
        return dx * dx + dy * dy + dz * dz < minSpacing * minSpacing;
      });
      if (!tooClose) {
        position = candidate;
        break;
      }
    }
    if (!position) continue;

    const src = modelUrls[i];
    if (!src) continue;
    placements.push({
      src,
      position,
      scale: 0.7 + rng() * 0.7,
      initialRotation: [rng() * Math.PI * 2, rng() * Math.PI * 2, rng() * Math.PI * 2],
      float: {
        amplitude: 0.2 + rng() * 0.3,
        speed: 0.2 + rng() * 0.4,
        phaseOffset: rng() * Math.PI * 2,
      },
      spin: {
        axis: axes[Math.floor(rng() * 3)],
        speed: (rng() - 0.5) * 0.5,
      },
    });
  }

  return placements;
};

export const ScatteredObjects = ({
  items,
  models,
  radius = [3, 11],
  yRange = [-2, 2.5],
  seed = 42,
  minSpacing = 1.5,
  onObjectClick,
  resolveModel,
}: ScatteredObjectsProps) => {
  const count = Math.max(items.length, models.length);

  const placements = useMemo(
    () => {
      const rng = mulberry32(seed);
      const modelUrls = resolveModelUrls(items, models, resolveModel, count, rng);
      return generatePlacements(count, modelUrls, radius, yRange, rng, minSpacing);
    },
    [count, items, models, resolveModel, radius, yRange, seed, minSpacing],
  );

  if (models.length === 0) return null;

  return (
    <>
      {placements.map((p, i) => {
        const item = items[i];
        const key = item?.id ?? `deco-${i}`;
        const handleClick =
          item && item.clickable !== false && onObjectClick
            ? () => onObjectClick(item.id)
            : undefined;
        return (
          <Suspense key={key} fallback={null}>
            {item?.planeSrc ? (
              <FloatingPlane
                src={item.planeSrc}
                position={p.position}
                scale={p.scale * 1.5}
                float={p.float}
                onClick={handleClick}
              />
            ) : (
              <FloatingObj
                src={p.src}
                position={p.position}
                scale={p.scale}
                initialRotation={p.initialRotation}
                float={p.float}
                spin={p.spin}
                onClick={handleClick}
              />
            )}
          </Suspense>
        );
      })}
    </>
  );
};
