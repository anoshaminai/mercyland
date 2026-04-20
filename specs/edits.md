# Spec: Void View Loading Behavior

## Goal
**Option 1** (preferred): Video background appears immediately, then 3D objects pop in individually as each one finishes loading. No blank screen, no full-scene loading gate — the user sees the void backdrop right away and objects materialize into it.

Fallbacks to Option 2 or 3 only if Option 1 turns out harder than expected (it shouldn't — R3F's Suspense model is built for this).

---

## Why Option 1 is the right default

The current setup already has the ingredients:
- `VoidVideoBackground` uses `useVideoTexture` — not gated by Suspense, ready the moment the browser can play the video
- Each `FloatingObj` uses `useGLTF` — naturally Suspense-driven, resolves per-asset
- There are 12 scattered objects; loading them sequentially feels organic if they fade in rather than pop

The only reason it's *not* working this way today is the Suspense structure: if there's a single `<Suspense>` at the scene root wrapping both background and objects, the whole tree waits for the slowest object. Splitting the boundaries fixes it.

---

## Implementation

### 1. Suspense structure

Target shape inside the `<Canvas>`:

```tsx
<Canvas>
  {/* Background renders immediately — no Suspense */}
  <VoidVideoBackground />

  {/* Lights, camera controls, post-fx — all eager */}
  <ambientLight intensity={0.35} />
  <directionalLight ... />
  <Environment preset="night" />
  <OrbitControls ... />
  <VoidPostFX />

  {/* Each scattered object in its OWN Suspense boundary with null fallback */}
  <ScatteredObjects count={12} models={MODEL_URLS} radius={[3, 11]} seed={42} />
</Canvas>
```

And inside `ScatteredObjects`:

```tsx
{positions.map((pos, i) => (
  <Suspense key={i} fallback={null}>
    <FadeInFloatingObj
      src={pickModel(i)}
      position={pos}
      scale={...}
      float={...}
      spin={...}
    />
  </Suspense>
))}
```

The `fallback={null}` is important — it means "render nothing for this one object until it's ready, but don't block siblings."

### 2. Fade-in on appear

Without this, objects pop in abruptly, which looks worse than a loading screen. Wrap each object in a simple opacity-ramp:

```tsx
// FadeInFloatingObj.tsx — wraps FloatingObj
function FadeInFloatingObj(props) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Start fade as soon as component mounts (i.e. GLB resolved)
    const raf = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <group>
      <FloatingObj {...props} materialOpacityOverride={opacity} />
    </group>
  );
}
```

In `FloatingObj`, when `materialOpacityOverride` is present and < 1, set `material.transparent = true` and `material.opacity = materialOpacityOverride` on every mesh, then `useFrame` to ease it toward 1 over ~600ms. Once it hits 1, set `transparent = false` to restore correct depth sorting.

Easing curve: `easeOutCubic` feels right (fast start, soft land). Duration 500–800ms.

### 3. Preload aggressively

At the top of the scene file, before any component mounts:

```ts
import { useGLTF } from '@react-three/drei';
import { MODEL_URLS } from './modelManifest';

MODEL_URLS.forEach(url => useGLTF.preload(url));
```

This kicks off fetches the moment the module loads. By the time the `<Canvas>` mounts, GLBs are often already parsed and ready — objects appear in the first frame or two rather than waiting for the network.

### 4. Verify video is not Suspense-gated

Audit the current tree. If `VoidVideoBackground` is inside a Suspense boundary that's also wrapping objects, move it out. Video should be a sibling of Suspense boundaries, never a child of one that waits on GLBs.

`useVideoTexture` doesn't throw a promise for Suspense; it resolves eagerly and returns an initially-empty texture. Safe to render immediately.

---

## What the user sees

1. Page loads → canvas mounts → video background is visible (may take a fraction of a second for the first frame, but no black screen beyond that)
2. Lights, controls, post-fx all active on the empty void
3. Objects fade in one-by-one over ~1–2 seconds as their GLBs resolve (possibly imperceptibly staggered if they all cache-hit)
4. No loading text, no spinner, no pop-in

---

## Acceptance criteria

- [ ] On first visit (cold cache), video background appears before any 3D object
- [ ] Objects fade in smoothly, not snap
- [ ] Slowest object does not delay any other object's appearance
- [ ] No visible "empty canvas" moment after video loads — controls work, lighting is correct, scene feels alive even with zero objects yet
- [ ] On warm cache (revisit), objects appear effectively instantly (preload + fade-in still runs but feels seamless)
- [ ] Works on mobile (Safari iOS, Chrome Android — video autoplay requires `muted + playsInline` which is already set)

---

## Fallback plan if Option 1 fights back

### Option 2 — video + loading sign until objects ready

Wrap all `<ScatteredObjects>` in a single `<Suspense>` with a fallback that renders a DOM overlay (via drei's `<Html />` or a sibling React component outside the Canvas).

```tsx
<Suspense fallback={<LoadingOverlay />}>
  <ScatteredObjects ... />
</Suspense>
```

`LoadingOverlay` would be a small centered text element like "loading the void..." in the same mono font as the nav. Use drei's `useProgress` hook to show a progress percentage if desired:

```tsx
const { progress } = useProgress();
return <div>{Math.round(progress)}%</div>;
```

This is ~20 lines more code than Option 1 and gives the user explicit feedback at the cost of a brief overlay.

### Option 3 — full loading screen until everything ready

Wrap the entire `<Canvas>` in a loading gate:

```tsx
function VoidView() {
  const [ready, setReady] = useState(false);
  // ... use useProgress or a manual counter to flip ready=true
  if (!ready) return <LoadingScreen />;
  return <Canvas>...</Canvas>;
}
```

Simplest to reason about, but the user stares at a loader until the slowest asset finishes. Feels less magical. Only fall back to this if Options 1 and 2 both have issues.

---

## Out of scope

- Progress bars inside the 3D scene (e.g. a loading ring around each object). Nice-to-have, not worth the complexity now.
- Retry logic for failed GLB loads. If a model 404s, its Suspense boundary errors — the rest of the scene keeps working, and the missing object is simply absent. Fine for now.
- Preloading the video more aggressively (e.g. via `<link rel="preload">` in `index.html`). Consider if video first-frame takes > 300ms in practice.