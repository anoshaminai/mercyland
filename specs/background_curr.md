# Void 3D View — Spec (v3)

Target: `scene-controls.tsx` + companions. Stack: `@react-three/fiber` + `@react-three/drei` + `three`.
Aesthetic: dark "liquid void" backdrop (ref: `void_short.mov`) with **bright, colorful objects floating in front** (ref: lipstick/lollipop/egg screenshot).

---

## 1. Status

Branch: `void_visualize`.

| Phase | Status |
|---|---|
| 1. Scene fundamentals | ✅ `b0c5ee7` — **lighting needs retune, see §4** |
| 2. Video background (placeholder) | ✅ `35eb174` |
| 2b. Procedural background shader | ⏸ not started |
| 3. Bokeh particles | 🟡 written, not mounted |
| 4. Post-processing | ✅ `00806b0` |
| 5. `.glb` loading + scatter | 🟡 wired; **models render grey, see §3** |
| 6. Final wiring | ✅ partial (video on, bokeh off) |

---

## 2. Current live wiring

```tsx
// scene-controls.tsx — abridged, reflects what's running now
<color attach="background" args={['#05080c']} />
<ambientLight intensity={0.15} />
<directionalLight position={[5, 8, 3]} intensity={1.2} color="#c8d8e8" />
<pointLight position={[-4, 2, -3]} intensity={0.6} color="#b88968" />
<Environment preset="night" />

{useVideoBackground ? <VoidVideoBackground /> : <VoidBackground ... />}
<ScatteredObjects count={12} models={MODEL_URLS} radius={[3, 11]} seed={42} />
{/* BokehParticles written but NOT mounted */}
<OrbitControls enableDamping dampingFactor={0.05} enablePan={false}
  autoRotate={autoRotate} autoRotateSpeed={0.3} minDistance={3} maxDistance={25} />
```
`<VoidPostFX />` mounts at the Canvas level — `EffectComposer` must be a direct `<Canvas>` child.

---

## 3. Blocker: models render monochrome grey

Source `.obj` files were authored in Adobe Substance 3D. Materials live in `.mdl` (Adobe's Material Definition Language, PBR) and `.mtl` with Adobe-specific extensions (`Pr`, `Pm`, `adobe_*`). `obj2gltf` (used by `scripts/convert-models-to-glb.sh`) understands neither, so converted `.glb`s ship with default grey material.

**The material override was correctly removed** from `floating-obj.tsx` — do not reintroduce it. The fix is to get real color into the GLBs, not to paint over them.

Two paths, in order:

1. **Land the full Substance bundles** (`.obj` + `.mtl` + `textures/`) onto the VM and re-run the convert script. Fixes basic albedo/normals via vanilla `.mtl`. Will likely still look drab — Adobe's PBR lives in the `.mdl`, which `obj2gltf` ignores.
2. **Blender export, per asset.** Open the original, verify viewport, File → Export → glTF 2.0 with "Include Materials" and "Apply Modifiers" checked. Embeds real PBR + textures into the `.glb`. Verify each output in [gltf.report](https://gltf.report) before committing.

Don't fight `obj2gltf`. Blender once is faster.

---

## 4. Lighting retune (required — new work)

Phase 1's lighting was tuned for the earlier assumption: *dark glossy objects rim-lit by colored lights, reflecting the environment.* New direction is the opposite — **bright saturated objects reading clearly against the dark void**. Key light does the work; environment is gentle fill.

Update `scene-controls.tsx`:

```tsx
<color attach="background" args={['#05080c']} />
<ambientLight intensity={0.35} color="#d8e0ea" />
<directionalLight position={[5, 8, 3]} intensity={1.8} color="#ffffff" />
<pointLight position={[-4, 2, -3]} intensity={0.6} color="#b88968" />
<pointLight position={[0, -3, 4]} intensity={0.4} color="#8faac4" />
<Environment preset="studio" environmentIntensity={0.3} />
```

Why each change:

- `ambient 0.15 → 0.35`, cool tint — keeps shadow sides from crushing to pure black.
- `directional 1.2 → 1.8`, **color `#c8d8e8` → `#ffffff`** — the cool key was shifting every object color bluer. White reads through saturated materials cleanly.
- **Added** cool underlight `pointLight` — subtle void-color on object undersides.
- `Environment preset "night" → "studio"` at `environmentIntensity={0.3}` — night dumped saturated blue into every reflection. Studio is neutral; low intensity keeps it from overpowering the key.

Optional per-material nudge in `floating-obj.tsx` if objects still read dim **after** they have real colors:
```ts
mesh.traverse((child) => {
  if (child.isMesh && child.material) {
    child.material.envMapIntensity = 0.4;
  }
});
```

---

## 5. `.glb` pipeline

Models live at `src/assets/models/*.glb`. Glob import stays:
```ts
// model-manifest.ts
const modules = import.meta.glob('@/assets/models/*.glb', {
  query: '?url', import: 'default', eager: true,
}) as Record<string, string>;
export const MODEL_URLS = Object.values(modules);
```

One-time Draco decoder setup + preload, in app entry:
```ts
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
MODEL_URLS.forEach(useGLTF.preload);
```

Draco compression is an **offline** step (`gltf-pipeline --draco` after `obj2gltf`, or Blender's export-time Draco). The runtime "decoder" is a ~200 KB WASM module the browser uses to unpack the shipped file — it's a dependency, not per-load work.

Per-instance still needs: clone the cached scene, center + normalize to unit bbox, then apply caller `scale`.

---

## 6. Remaining work, in order

1. **Unblock §3.** Land Substance bundles + reconvert, or Blender-export. Verify against the reference screenshot.
2. **Apply §4 lighting retune.** Single-file edit; test against colorful models.
3. **Mount bokeh.** Add `<BokehParticles count={50} />` in `scene-controls.tsx`. Commit §§1–3 together.
4. **Phase 2b — procedural shader.** Fullscreen triangle, fBm + fake specular + vignette. Uniforms: `uTime`, `uResolution`, `uFlowDir` (default `vec2(-1.0, 0.1)`), `uBaseColor`, `uHighlightCool`, `uHighlightWarm`, `uVignetteStrength`. When `autoRotate` off, advance `uTime` at 0.35×. Toggle via existing `useVideoBackground` prop on `<SceneControls>`.

---

## 7. Acceptance criteria

- [ ] Background reads as "dark liquid" at a glance — no grey, no whitening fog.
- [ ] **Objects render in their authored colors** (red lipstick reads red, pastel-blue egg reads pastel-blue). They are clearly the visual focus.
- [ ] ≥ 2 warm amber bokeh particles visible in any given frame.
- [ ] 12 `.glb` objects scatter at radius 3–11, stable across reloads, no overlaps.
- [ ] 60 fps on an M1 MacBook in Chrome at 1440×900.
- [ ] OrbitControls behavior unchanged (pan off, autorotate, min/max distance).
- [ ] No TypeScript errors, no strict-mode double-mount warnings.

---

## 8. Resolved decisions

1. **Format**: `.glb` (migrated from `.obj`). Draco-compressed offline, decoded in-browser.
2. **Location**: `src/assets/models/*.glb`, Vite-bundled (not `/public`).
3. **Scatter**: 12 objects, seeded RNG (mulberry32), rejection sampling, radius 3–11, y-range −2 to 2.5.
4. **Materials**: preserve whatever the GLB ships with. No code-side overrides.
5. **Video placeholder**: default on until Phase 2b ships; loop seam acknowledged.
6. **Autorotate → flow**: shader `uTime` advances at 0.35× when autorotate is off.
7. **Colors**: amber `#b88968`, cool blue-white `#bcd3d6` — final.

---

## 9. Out of scope

- Reactive audio.
- Raymarched SDF background.
- Mobile quality tiers.
- KTX2 texture compression (revisit if total asset payload exceeds ~5 MB).