// Mercy Land — House World: scene asset loader (BUILD.md §2)
// Scene images are referenced by *filename* in scenes.data.ts. Resolve them to real bundled
// URLs via Vite's glob so a missing/renamed asset degrades to `undefined` at runtime rather
// than breaking the build. The dev validator surfaces missing crops separately.

const urls = import.meta.glob('../assets/images/scenes/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Resolve a scene image filename (e.g. `start_house.png`) to its bundled URL, or `undefined`
 *  if no such asset exists. Pass `undefined` (e.g. a scene with no `imageTall`) and get
 *  `undefined` back — callers fall back to `imageWide`. */
export function resolveSceneAsset(name?: string): string | undefined {
  if (!name) return undefined;
  return urls[`../assets/images/scenes/${name}`];
}
