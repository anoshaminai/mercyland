// Mercy Land — House World: behind-the-scenes photo loader (mirrors scene-assets.ts)
// Unlike scene images, BTS photos aren't referenced by name anywhere — the gallery just shows
// all of them. So this globs the whole folder: DROP A PHOTO IN AND IT APPEARS, no code edit.
// Order is the filename order (natural-sorted, so IMG_2 comes before IMG_10) — rename to reorder.
//
// `name` is carried alongside the bundled url because the url is content-hashed at build time
// (IMG_5783-DE8ajn1Z.jpeg) and so can't be used as a stable key. Captions are keyed on `name`
// in content-registry.tsx — this file stays pure plumbing and holds no band-authored text.

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

const modules = import.meta.glob('../assets/images/summertime_bts/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export interface BtsPhoto {
  /** Source filename, e.g. `IMG_5783.jpeg`. The caption key. */
  name: string;
  /** Bundled, content-hashed URL. */
  url: string;
  /** Band-authored; absent for uncaptioned photos. Attached in content-registry.tsx. */
  caption?: string;
}

/** Every photo in `src/assets/images/summertime_bts/`. Empty until photos exist — the gallery
 *  renders a "coming soon" placeholder in that case. */
export const btsPhotos: BtsPhoto[] = Object.keys(modules)
  .filter((path) => IMAGE_RE.test(path))
  .sort(collator.compare)
  .map((path) => ({ name: path.split('/').pop() as string, url: modules[path] }));
