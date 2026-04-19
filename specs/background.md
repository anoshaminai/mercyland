# Void 3D View — Visual Overhaul Spec

Target file: `SceneControls.tsx` (and new companion files)
Stack assumed: `@react-three/fiber`, `@react-three/drei`, `three`, TypeScript
Reference: `void_short.mov` (dark liquid / black mirror aesthetic)

---

## 1. Goal

Replace the current bright, flat grey environment with the dark, glossy, slowly-flowing "void" aesthetic from the reference clip. Keep the existing public API (`<SceneControls autoRotate />`) so upstream callers don't break. Add an `.obj` loading system for the floating objects.

---

## 1b. Progress (as of 2026-04-18)

Branch: `void_visualize`.

| Phase | Status | Notes |
|---|---|---|
| 1 — Scene fundamentals | ✅ committed (`b0c5ee7`) | |
| 2 — Video background placeholder | ✅ committed (`35eb174`) | Loop seam still visible; acceptable for now. |
| 2b — Procedural shader | ⏸ not started | Video placeholder still active. |
| 3 — Bokeh particles | 🟡 written, uncommitted, **not mounted** | `bokeh-particles.tsx` exists but is not imported in `scene-controls.tsx`. To enable, render `<BokehParticles count={50} />` inside the scene. |
| 4 — Post-processing | ✅ committed (`00806b0`) | |
| 5 — `.obj` loading + scatter | 🟡 written, uncommitted, **wired in** | `floating-obj.tsx`, `scattered-objects.tsx`, `model-manifest.ts`, `lib/normalize-obj.ts`, `lib/rng.ts`. Manifest switched from `.obj` to `.glb` — see blocker below. |
| 6 — Final wiring | ✅ partial | `scene-controls.tsx` mounts `ScatteredObjects`; Bokeh not mounted; `VoidPostFX` confirmed at Canvas level per Phase 4. |

### Active blocker — models render monochrome grey

The `.obj` source files (from Adobe Substance 3D Assets) reference sidecar `.mtl` and `.mdl` files and texture images that never made it into the VM (`mac → vm` transfer brought only the `.obj`). `obj2gltf` (used by `scripts/convert-models-to-glb.sh`) therefore produced `.glb` files with a default grey material — verified by loading them in an external viewer.

We also removed a material override in `floating-obj.tsx` that was forcing every mesh to a single grey `MeshPhysicalMaterial`; the component now uses each GLB's baked material (correct direction regardless of source fix). But because the GLBs themselves carry no color, the scene still reads monochrome.

**Next step when resuming:** user is collecting the full Substance 3D bundles (`.obj + .mtl + textures/`) from the Mac. Once present in `src/assets/models/`, re-run `scripts/convert-models-to-glb.sh`. If that still looks drab (expected — `.mtl` is basic Phong, not the Substance PBR lurking in `.mdl`), fall back to opening the originals in Blender and exporting `.glb` directly (preserves PBR + bakes textures into the file).

### What's next, in order
1. Unblock Phase 5: fix model color (per above).
2. Commit Phase 3 (bokeh) + Phase 5 (models) together once Phase 5 is visually acceptable. Mount `<BokehParticles />` in `scene-controls.tsx` as part of the same commit.
3. Phase 2b: procedural shader to replace the video placeholder.
4. Revisit acceptance criteria in §8.

---

## 2. Current State

```tsx
<color attach="background" args={['#6c6c7a']} />      // mid-grey daylight
<fog attach="fog" args={['#e7e7f2', 10, 35]} />        // whitening fog
<ambientLight intensity={0.7} />                       // flat fill
<OrbitControls ... />
```

(Snapshot from before Phase 1 — retained for historical reference. Live code reflects Phase 1+.)

Every one of these lines is pulling in the opposite direction from the reference:

| Current | Target |
|---|---|
| `#6c6c7a` background | ~`#05080c` near-black with blue undertone |
| White fog → lighter toward distance | Implied vignette → darker toward edges |
| Flat ambient at 0.7 | Punchy, narrow specular highlights (needs directional lights + env map) |
| No PBR environment | Glossy reflections are the entire point of the look |

---

## 3. Visual Target (decoded from reference)

- **Base color:** very dark blue-black, roughly `#05080c`–`#0a0f16`
- **Surface pattern:** organic "crumpled foil / oil slick / plastic wrap" — domain-warped noise driving normals, producing anisotropic-looking specular streaks
- **Highlights:** small, bright, cool (blue-white `~#b8d0d8`) — scattered, not uniform
- **Bokeh layer:** two populations of soft out-of-focus dots:
  - warm amber `~#b88968`, small, low opacity, drifting
  - cool blue-white `~#bcd3d6`, slightly larger, sparser
- **Motion:** slow leftward flow, ≲ 0.1 Hz dominant frequency; feels oceanic, not turbulent
- **Edge falloff:** darker at frame edges (vignette), brightest density of highlights near center
- **No visible geometry in reference clip** — it's a pure environment plate. Floating `.obj` objects will be added on top and should **reflect** this environment.

---

## 4. Options for the Background

### Option A — Use the video directly (`VideoTexture`)
Map the clip onto a screen-aligned quad or an inverted sphere.

- ✅ Exact match to reference; zero re-creation work.
- ✅ Supported natively via `drei`'s `useVideoTexture`.
- ❌ File size: the supplied clip is 58 MB / 1.17 s ProRes 4K. A usable loopable version (10 s, 1080p, H.264 or WebM/VP9) would be ~4–12 MB — acceptable but non-trivial.
- ❌ Needs a seamless loop version (current clip is too short and not loop-prepped).
- ❌ **Cannot drive reflections on the floating `.obj` objects** — a 2D video can't be sampled as an environment map without expensive workarounds (render-to-cubemap each frame). Objects would look detached from the scene.
- ❌ Autoplay + mobile battery drain. iOS requires `muted` + `playsInline`.
- **Verdict:** Viable as a fallback or "hero shot only" mode. Not recommended as the primary path because the objects won't reflect anything.

### Option B — Equirectangular environment (HDR or animated EXR/video)
Produce one good 2048×1024 equirectangular map (still or video) in Blender/After Effects, load via `<Environment>` from drei.

- ✅ Objects reflect it for free; unified look.
- ✅ Static HDR is tiny and fast.
- ❌ Requires offline authoring pipeline you may not have.
- ❌ Static HDR loses the motion. Animated equirect videos are heavy and still don't match perfectly.
- **Verdict:** Good for object reflections. Pair with something else for the moving background.

### Option C — Procedural fragment shader ⭐ recommended
A custom GLSL shader on a screen-aligned quad (rendered behind everything). Recipe:

1. Sample domain-warped fBm noise at 2–3 octaves, offset by `uTime * flowDir`.
2. Derive a pseudo-normal from the noise's gradient.
3. Fake specular: `pow(max(dot(reflect(viewDir, normal), lightDir), 0.0), 64.0)` → tight highlights.
4. Mix cool-tint into highlights, warm-tint into lows.
5. Apply radial vignette in the fragment.

- ✅ Fully procedural — no assets, no loading, no file size.
- ✅ Tunable live (leva/dat.gui during development).
- ✅ Deterministic and resolution-independent.
- ✅ ~2 hours to a first pass if using a reference noise implementation (e.g. Ashima `snoise`).
- ❌ Still doesn't give reflections on objects — handle that with Option B + a baked HDR.
- **Verdict:** Primary background strategy.

### Option D — Animated normal-mapped inverted sphere with `MeshPhysicalMaterial`
Big inside-out sphere surrounds the camera. Use a tileable normal map + scrolling UV offsets + high metalness.

- ✅ Real PBR lighting, reacts to lights you place.
- ✅ Simple code.
- ❌ Needs a normal map asset. Procedural shader (C) avoids this.
- ❌ Sphere geometry is visible as a sphere if you look too hard — pole pinching.
- **Verdict:** Decent alternative if team prefers texture-based authoring over GLSL.

### Option E — Post-processing stack (always on, combine with any of the above)
`@react-three/postprocessing` pipeline:
- **Bloom** (intensity ~0.6, threshold ~0.7) — amplifies the highlights into the signature glow.
- **Vignette** (offset 0.3, darkness 0.8) — edge darkening.
- **Noise / film grain** (opacity 0.05) — breaks up banding in the dark regions.
- **Chromatic aberration** (offset ~0.0006) — subtle, adds the organic feel.

This is not optional. Without bloom, no procedural background will read as the reference clip. Treat this as mandatory regardless of which background option is chosen.

### Recommended combination

**Primary path:** **C (procedural shader) + B-lite (one static night/studio HDR for object reflections) + E (post-processing).** Add **F (particle bokeh, below)** as a final touch.

---

## 5. Option F — Bokeh particle layer

Separately from the background shader, spawn ~30–60 soft additive sprites:
- ~70% warm amber (`#b88968`, opacity 0.3, size 0.04–0.12 of screen height)
- ~30% cool blue-white (`#bcd3d6`, opacity 0.5, size 0.02–0.08)
- Each drifts with a slow random velocity + slight parallax with the camera
- Render with `AdditiveBlending`, `depthWrite: false`
- Use a circular radial-falloff texture (can be generated in-code via a 64×64 canvas)

Implement as an `<InstancedMesh>` for performance.

---

## 6. `.obj` loading system

### Asset location & imports

Models live in **`/src/assets/models/*.obj`** (bundled by Vite, not in `/public`). Two patterns:

**Single model, explicit import:**
```ts
import shapeUrl from '@/assets/models/shape-01.obj?url';
// ...
<FloatingObj src={shapeUrl} />
```

**All models, glob import (recommended for the scatter use case):**
```ts
// modelManifest.ts
const modules = import.meta.glob('@/assets/models/*.obj', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const MODEL_URLS = Object.values(modules);
```
This gives a static array of all `.obj` URLs at build time — drop new files into the folder and they're picked up automatically. No hardcoded filenames.

### Component API
```tsx
<FloatingObj
  src={shapeUrl}
  position={[2, 0, 0]}
  scale={1}
  float={{ amplitude: 0.3, speed: 0.4 }}
  spin={{ axis: 'y', speed: 0.15 }}
/>
```

### Implementation notes
1. Use `OBJLoader` from `three-stdlib` via `useLoader`:
   ```ts
   const obj = useLoader(OBJLoader, src)
   ```
2. **Clone before mutating** — `useLoader` caches; a raw returned group shared across instances will explode when you override materials. Use `useMemo(() => obj.clone(true), [obj])`.
3. **Override materials.** `.obj` files often have no material or ship with flat `.mtl` — replace every mesh's material with:
   ```ts
   new THREE.MeshPhysicalMaterial({
     color: '#0a0a0f',
     metalness: 1.0,
     roughness: 0.22,
     clearcoat: 1.0,
     clearcoatRoughness: 0.15,
     envMapIntensity: 1.2,
   })
   ```
4. **Center + normalize.** After loading:
   - Compute bounding box
   - Recenter geometry around origin
   - Scale so max dimension = 1 (caller-provided `scale` then multiplies predictably)
5. **Float animation** via `useFrame`:
   ```ts
   ref.current.position.y = baseY + Math.sin(t * speed + phaseOffset) * amplitude
   ref.current.rotation[axis] += delta * spin.speed
   ```
6. **Suspense boundary** at the parent with a `null` fallback (or a placeholder low-poly shape).

### Scatter helper (`ScatteredObjects.tsx`)

For placing 10–15 objects randomly without overlap:

```tsx
<ScatteredObjects
  count={12}
  models={MODEL_URLS}      // from the glob above
  radius={[3, 11]}         // min/max distance from origin
  yRange={[-2, 2.5]}       // vertical spread
  seed={42}                // stable across reloads
/>
```

Implementation:
1. Seeded RNG (e.g. `mulberry32`) — critical so hot-reload doesn't teleport objects mid-session.
2. **Rejection sampling** for placement: generate candidate positions, reject if within `minSpacing` (say 1.5 units) of any already-placed object. Cap at ~30 attempts per object then give up.
3. Pick model URL via `rng() * models.length | 0` — round-robin-ish via the seeded RNG so repeats are deterministic.
4. Per-instance randomization:
   - `scale`: 0.7–1.4
   - Initial Euler rotation: fully random on all axes
   - `float.speed`: 0.2–0.6, `float.amplitude`: 0.2–0.5
   - `spin.speed`: -0.25 to +0.25 (signed for variety in direction)
   - `float.phaseOffset`: random [0, 2π] — prevents objects bobbing in sync
5. Stay outside a central "camera safe zone" — enforce `radius[0] ≥ 3` and the rejection pass handles proximity to the origin automatically.

### Why not `useGLTF`?
User explicitly asked for `.obj`. If `.gltf`/`.glb` is later acceptable, prefer it: smaller files, embedded materials, Draco compression. Flag this for follow-up.

---

## 7. Task Breakdown

### Phase 1 — Replace scene fundamentals ✅
- Remove `<fog>`.
- Change background `<color>` to `#05080c` (this is the fallback while the shader loads).
- Replace the single `ambientLight` with:
  - `ambientLight intensity={0.15}` (just enough to avoid pure-black shadow terminators)
  - one `directionalLight` at `[5, 8, 3]`, intensity 1.2, cool-tinted (`#c8d8e8`)
  - one `pointLight` at `[-4, 2, -3]`, intensity 0.6, warm-tinted (`#b88968`), for rim reflections on objects
- Add `<Environment>` from drei with `preset="night"` (quick start) or a custom HDR in `/public/env/void.hdr` when ready.

### Phase 2 — Video background (placeholder) ✅

User has a non-loop-smooth video file available; use it as a fast placeholder so the rest of the scene can be built and tuned against something close to the target, before investing in the shader.

- New file `VoidVideoBackground.tsx`.
- Place the source video at `/src/assets/video/void.mp4` (or whatever extension is supplied). Import via `?url`.
- Use drei's `useVideoTexture` with `{ muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous' }`.
- Render on a screen-aligned plane with `renderOrder={-1000}`, `depthTest={false}`, `depthWrite={false}`.
- Alternatively assign to `scene.background = videoTexture` for a simpler mount — either works; the plane approach is safer for post-fx interaction.
- Cover-fit the plane to the viewport (compute scale from camera FOV + distance, or use a fullscreen-triangle shader that samples with `screenUV`).
- Accept: "it reads as the target background." Loop seam visibility is acknowledged as a known issue, resolved by Phase 2b.

### Phase 2b — Procedural background shader (upgrade) ⏸ not started

Replaces Phase 2. Same mount pattern (screen-aligned plane, `renderOrder={-1000}`, depth disabled).

- New file `VoidBackground.tsx`.
- Fullscreen triangle (or `<ScreenQuad>` from drei).
- Fragment shader with uniforms: `uTime`, `uResolution`, `uFlowDir` (default `vec2(-1.0, 0.1)`), `uBaseColor`, `uHighlightCool`, `uHighlightWarm`, `uVignetteStrength`, `uAutoRotateActive`.
- Bind `uTime` via `useFrame`. When `autoRotate` is active on `<SceneControls>`, advance `uTime` at full speed; when it's off, advance at 0.35× (flow still continues, just slower — per decision in §10).
- Expose tunables through props so the component can be tuned without editing GLSL.
- Behind a feature flag initially (`<VoidBackground />` vs `<VoidVideoBackground />`) so the video fallback stays available.

### Phase 3 — Bokeh layer 🟡 written, not mounted
- New file `BokehParticles.tsx`.
- `InstancedMesh` of ~50 planes, billboarded to camera.
- Radial falloff texture generated once via `CanvasTexture` from a 64×64 `OffscreenCanvas`.
- Per-instance color + size + velocity stored in attribute buffers.
- Update positions in `useFrame`; wrap when they leave view frustum.

### Phase 4 — Post-processing ✅
- Add `@react-three/postprocessing` to dependencies.
- New file `VoidPostFX.tsx` wrapping `<EffectComposer>` with: `Bloom`, `Vignette`, `ChromaticAberration`, `Noise`.
- Mount inside the Canvas, after all scene content.

### Phase 5 — `.obj` loading + scatter 🟡 blocked on model color
- ✅ `floating-obj.tsx`, `scattered-objects.tsx`, `model-manifest.ts` exist.
- ✅ `lib/normalize-obj.ts` + `lib/rng.ts` (mulberry32) exist.
- ✅ Wired in `scene-controls.tsx` via `<ScatteredObjects count={12} models={MODEL_URLS} radius={[3, 11]} seed={42} />`.
- ⚠ **Deviation from spec**: the pipeline now ships `.glb` (not `.obj`). `scripts/convert-models-to-glb.sh` uses `obj2gltf` to convert offline; `model-manifest.ts` globs `*.glb`; `floating-obj.tsx` uses `useGLTF` (drei) instead of `OBJLoader`. This makes §6's `.obj`-specific guidance historical.
- ⚠ **Material override removed** from `floating-obj.tsx`. The spec in §6 step 3 called for force-replacing every mesh's material with a glossy `MeshPhysicalMaterial`. That was masking the underlying color issue — now removed; components use GLB-baked materials.
- ❌ **Blocker**: converted `.glb` files have no color (see §1b). Resuming work means landing the texture bundles + reconverting, *not* reintroducing the material override.

### Phase 6 — Wire it all together in `SceneControls.tsx` ✅ partial (bokeh not mounted; video still default)
```tsx
import { MODEL_URLS } from './modelManifest';

export const SceneControls = ({
  autoRotate = true,
  useVideoBackground = true,   // Phase 2 placeholder; flip to false once shader ships
}: {
  autoRotate?: boolean;
  useVideoBackground?: boolean;
}) => (
  <>
    <color attach="background" args={['#05080c']} />
    <ambientLight intensity={0.15} />
    <directionalLight position={[5, 8, 3]} intensity={1.2} color="#c8d8e8" />
    <pointLight position={[-4, 2, -3]} intensity={0.6} color="#b88968" />
    <Environment preset="night" />

    {useVideoBackground
      ? <VoidVideoBackground />
      : <VoidBackground autoRotateActive={autoRotate} />}

    <ScatteredObjects count={12} models={MODEL_URLS} radius={[3, 11]} seed={42} />
    <BokehParticles count={50} />

    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.3}
      minDistance={3}
      maxDistance={25}
    />
  </>
);
```
`<VoidPostFX />` is mounted at the Canvas level, not inside `SceneControls`, because `EffectComposer` has to be a direct child of `<Canvas>`.

---

## 8. Acceptance criteria

- [ ] Background reads as "dark liquid" at a glance — no visible grey, no whitening fog.
- [ ] Specular highlights on the background are tight and cool-toned, not blown out.
- [ ] At least two warm amber bokeh particles are visible in any given frame.
- [ ] 10–15 `.obj` objects scatter randomly (seeded, stable across reloads) at radius 3–11 from origin with no overlaps.
- [ ] A loaded `.obj` object with no provided `.mtl` renders with a glossy metallic surface that clearly picks up the environment (you can see the cool/warm light dichotomy on its surface).
- [ ] Scene still runs at 60 fps on an M1 MacBook in Chrome at 1440×900.
- [ ] Bundle size increase is < 150 KB gz for code (post-processing + three-stdlib OBJLoader); video asset size is tracked separately.
- [ ] No TypeScript errors, no React strict-mode double-mount warnings.
- [ ] OrbitControls behavior (pan disabled, autorotate, min/max distance) unchanged.

---

## 9. Dependencies to add

```jsonc
"@react-three/postprocessing": "^2.16.0",
"three-stdlib": "^2.29.0"        // if not already present via drei
```

Everything else (`three`, `@react-three/fiber`, `@react-three/drei`) is assumed present.

---

## 10. Resolved decisions

1. **Model location:** `/src/assets/models/*.obj`, imported via Vite's `import.meta.glob` with `?url` query → static URL array at build time.
2. **Object count & placement:** 12 objects scattered randomly via rejection sampling, seeded RNG so positions are stable across reloads. Targeted radius 3–11 from origin, vertical range −2 to 2.5.
3. **Video background available:** existing clip is not loop-smooth but good enough as a Phase 2 placeholder. Ships as `VoidVideoBackground` behind a `useVideoBackground` prop, defaulting to `true` until the procedural shader lands.
4. **Autorotate → flow direction:** when `autoRotate` is off, the shader's `uTime` advances at 0.35× the normal rate — flow continues but is visibly calmer. Full parity when rotating.
5. **Colors:** warm amber `#b88968` and cool blue-white `#bcd3d6` are final; no theming hook needed.

---

## 11. Out of scope (flag for later)

- Reactive audio (background pulsing to sound).
- True raymarched background (SDF liquid) — much heavier; revisit if the shader approach isn't believable enough.
- Mobile-specific quality tiers (disable post-fx on low-end).
- `.glb` migration.