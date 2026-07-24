// Mercy Land — House World: ScenePanel host (spec v4 §4)
// The persistent, non-dismissible host for registry content — the sibling of OverlayShell. The
// SAME content components render here or in an overlay; they don't know which host they're in.
// Kept out of Scene (which stays generic and registry-unaware) and injected via Scene.renderPanel.
// Scene provides the fixed-foreground `.scene__panel` frame (spec §5: above the photo, never
// panned, clear of the thumb-zone returns); this just resolves the id and renders it.

import { contentRegistry } from '../../data/content-registry';
import type { ScenePanel as ScenePanelData } from '../../types/world.types';

export function ScenePanel({ panel }: { panel: ScenePanelData }) {
  const Content = contentRegistry[panel.content];
  return <Content {...(panel.props ?? {})} />;
}
