# Spec: Add 3D Object + Fix Route 404s on Render

## 1. Add another 3D object to the void

### Context
The void uses `.glb` files loaded via `useGLTF` from drei. Source assets are authored in Adobe Substance 3D and ship as `.obj` + `.mtl` + `.mdl` + textures. Convert to `.glb` using the existing script (`scripts/convert-models-to-glb.sh`), which wraps `obj2gltf`.

### Conversion

```bash
./scripts/convert-models-to-glb.sh <path-to-obj-directory>
```

Make sure the directory contains the full Substance bundle: the `.obj`, the sibling `.mtl`, and any referenced texture files (usually in a `textures/` subfolder). `obj2gltf` needs the `.mtl` and textures co-located to pick up materials — if they're missing, the output will be grey.

### Material caveat

`obj2gltf` reads vanilla `.mtl` (diffuse color, basic texture maps) but **does not understand Adobe's PBR extensions** (`Pr`, `Pm`, `adobe_*`) that live in the `.mdl` file. If the asset relies heavily on those for its look, the `.glb` will render duller/darker than the Substance preview. Options:

- Accept the flatter look (acceptable for many assets — the void's lighting and post-processing compensate)
- Strip/simplify the `.mtl` to basic diffuse + normal maps before conversion
- If a specific asset must look exactly like its Substance preview, flag it and we'll figure out an alternative path

### Steps

1. Drop the Substance bundle into the staging folder expected by `scripts/convert-models-to-glb.sh` (check the script for the exact input path)
2. Run the script
3. Drag the output `.glb` into [gltf.report](https://gltf.report) to verify — confirm geometry, scale, and materials look acceptable
4. Move the `.glb` to `src/assets/models/` alongside the existing models
5. Wire it into the scatter component:
   - Add to `MODEL_URLS`
   - Add `useGLTF.preload('/src/assets/models/<n>.glb')`

### Verification checklist
- [ ] `.glb` renders in gltf.report with geometry and at least basic color
- [ ] File size comparable to other models in `src/assets/models/`
- [ ] Added to `MODEL_URLS` and the preload list
- [ ] Appears in the void scene after dev-server restart

---

## 2. Fix: `/void` and `/flat` routes 404 on deployed site

### Root cause
The repo has `public/_redirects` with `/* /index.html 200`. **That file is Netlify syntax and Render ignores it.** Render has its own rewrite system.

Locally it works because `vite dev` handles SPA fallback automatically. On deploy, Render looks for a file at `/void`, doesn't find one, and returns 404 before React Router ever loads. Same issue on preview deployments (they use the same static-site config).

The `favicon.ico:1 404` in your console is unrelated — just a missing favicon. Ignore or fix separately.

### Fix: add a Render rewrite rule

Two paths. Pick one.

#### Option A — Render dashboard (fastest)

1. Go to the Render dashboard → this static site → **Redirects/Rewrites** tab
2. Click **Add Rule**
3. Configure:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** **Rewrite** (not Redirect — Rewrite keeps the URL in the address bar, Redirect changes it to `/`)
4. Save. Changes apply immediately to the live site and future previews.

#### Option B — `render.yaml` in the repo (version-controlled)

Add a file at the repo root called `render.yaml`:

```yaml
services:
  - type: web
    name: mercyland
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Adjust `name`, `buildCommand`, and `staticPublishPath` to match your current Render config if they differ. Commit and push — Render picks it up automatically on next deploy.

Option B is better long-term (rewrite rule is in version control alongside the code), but Option A unblocks you in 60 seconds.

### Cleanup: `public/_redirects`

After the Render rule is working, delete `public/_redirects` — it's dead weight and only adds confusion for anyone reading the repo later. (Or leave it with a comment explaining it's a Netlify artifact, if there's any chance of future migration.)

### Verification
1. Deploy (or wait for Render to redeploy after pushing `render.yaml`)
2. Visit `https://<your-site>/void` directly in a fresh tab — should load the void view, not 404
3. Refresh while on `/void` — should stay on `/void`
4. Same for `/flat` and any other route
5. Check a preview URL to confirm previews also work

### Reference
[Render docs — Static Site Redirects and Rewrites](https://render.com/docs/redirects-rewrites). Key behavior to note: *"Render does not apply redirect or rewrite rules to a path if a resource exists at that path."* Meaning your JS/CSS/image files still serve normally — the rewrite only kicks in for unknown paths.