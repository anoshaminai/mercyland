// Mercy Land — House World: dev-time validator
// Turns the launch-graph validation checklist into runnable checks. Call once in dev
// (e.g. from main.tsx behind import.meta.env.DEV) and read the console. Not for production.

import type { WorldConfig, SceneId } from '../types/world.types';
import { contentRegistry } from '../data/content-registry';

export interface WorldIssue {
  level: 'error' | 'warn';
  scene?: SceneId;
  message: string;
}

export function validateWorld(world: WorldConfig): WorldIssue[] {
  const issues: WorldIssue[] = [];
  const ids = Object.keys(world.scenes) as SceneId[];
  const inbound = new Set<SceneId>();

  for (const id of ids) {
    const scene = world.scenes[id];

    // panel content must exist in the registry
    if (scene.panel && !(scene.panel.content in contentRegistry)) {
      issues.push({ level: 'error', scene: id, message: `panel content "${scene.panel.content}" not in registry` });
    }

    // `imageTall` is optional (mobile cover-fits imageWide), but mobileZoom only does something
    // on the pannable path — setting it elsewhere is a data mistake, not a taste call.
    if (scene.layout !== 'pannable' && scene.mobileZoom !== undefined) {
      issues.push({ level: 'warn', scene: id, message: 'mobileZoom set on a non-pannable scene (ignored)' });
    }

    let outboundTravel = 0;
    for (const h of scene.hotspots) {
      const t = h.target;
      if (t.type === 'travel') {
        outboundTravel++;
        if (!(t.sceneId in world.scenes)) {
          issues.push({ level: 'error', scene: id, message: `hotspot "${h.id}" travels to missing scene "${t.sceneId}"` });
        } else {
          inbound.add(t.sceneId);
        }
      }
      if (t.type === 'overlay' && !(t.content in contentRegistry)) {
        issues.push({ level: 'error', scene: id, message: `hotspot "${h.id}" overlay "${t.content}" not in registry` });
      }
      if (t.type === 'external' && !t.url) {
        issues.push({ level: 'warn', scene: id, message: `hotspot "${h.id}" external URL is empty (TODO link)` });
      }
    }

    // density: more hotspots than the cap is fine (edge indicators handle it) but worth surfacing
    if (scene.maxVisibleLabels && scene.hotspots.length > scene.maxVisibleLabels) {
      issues.push({
        level: 'warn', scene: id,
        message: `${scene.hotspots.length} hotspots > maxVisibleLabels ${scene.maxVisibleLabels} — ${scene.hotspots.length - scene.maxVisibleLabels} will be edge/panned`,
      });
    }

    if (outboundTravel === 0 && scene.hotspots.length > 0) {
      issues.push({ level: 'warn', scene: id, message: 'dead end — no outbound travel (universal returns still work)' });
    }
  }

  // orphans: nothing travels here, and it's not the start scene
  for (const id of ids) {
    if (id !== world.startSceneId && !inbound.has(id)) {
      issues.push({ level: 'error', scene: id, message: 'ORPHAN — no scene travels here (unreachable except deep link)' });
    }
  }

  // reachability from start (BFS over travel edges)
  const seen = new Set<SceneId>([world.startSceneId]);
  const queue: SceneId[] = [world.startSceneId];
  while (queue.length) {
    const cur = world.scenes[queue.shift()!];
    for (const h of cur.hotspots) {
      if (h.target.type === 'travel' && !seen.has(h.target.sceneId)) {
        seen.add(h.target.sceneId);
        queue.push(h.target.sceneId);
      }
    }
  }
  for (const id of ids) {
    if (!seen.has(id)) {
      issues.push({ level: 'warn', scene: id, message: 'not reachable from start via travel edges' });
    }
  }

  return issues;
}

/** Convenience: log a readable report. */
export function reportWorld(world: WorldConfig): void {
  const issues = validateWorld(world);
  if (!issues.length) {
    // eslint-disable-next-line no-console
    console.info('[world] ✓ no issues');
    return;
  }
  for (const i of issues) {
    const where = i.scene ? `[${i.scene}] ` : '';
    // eslint-disable-next-line no-console
    (i.level === 'error' ? console.error : console.warn)(`[world] ${where}${i.message}`);
  }
}
