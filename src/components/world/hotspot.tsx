// Mercy Land — House World: Hotspot (spec v4 §2)
// The key consistent primitive: a clickable label anchored to a photo feature. This component
// owns the *behavior contract* (real focusable DOM, hover==focus, 44px tap floor, scrim
// legibility, external cue, reserved visited/locked). Look comes entirely from §6 tokens.
//
// Positioning: the component places itself at its normalized `anchor` (percent of the parent
// image box, which the Scene sizes). `offset` nudges the label off a busy feature. Whether a
// hotspot is on- or off-viewport is the Scene's concern — an off-viewport hotspot still renders
// here, in the DOM and in tab order (the accessibility floor, §5); the Scene additionally draws
// an aria-hidden EdgeIndicator for it.

import type { CSSProperties } from 'react';
import type { Hotspot as HotspotData } from '../../types/world.types';

export interface HotspotProps {
  hotspot: HotspotData;
  /** Fired when the hotspot is activated (click / Enter / Space). External targets are plain
   *  anchors and navigate THEMSELVES — but they still report here, so the host has a single
   *  activation choke point covering all four target types (analytics). The host must therefore
   *  do no navigating of its own for `external`. A reveal-only tap is not an activation and does
   *  not fire this. */
  onActivate: (hotspot: HotspotData) => void;
  /** Fired when the hotspot receives focus. The Scene uses this to auto-pan an off-viewport
   *  hotspot into view (focus-driven panning, §5). */
  onFocus?: (hotspot: HotspotData) => void;
  /** Density-cap overflow: render as a compact marker that reveals its label on hover/focus.
   *  Still a full 44px focusable control; nothing is unmounted (§5). */
  collapsed?: boolean;
  /** Touch two-step (§5, `collapseLabelsOnMobile`): the first activation only REVEALS the label,
   *  the second navigates. Pointer devices get this for free from hover; touch has no hover, so
   *  without it a bare marker is an unlabelled trapdoor — and for `external` targets that means
   *  leaving the site on an accidental tap. */
  requireReveal?: boolean;
  /** Whether this hotspot is the currently revealed one (Scene owns the single-open invariant). */
  revealed?: boolean;
  /** Ask the Scene to reveal this hotspot (it also pans it clear of the viewport edge). */
  onReveal?: (hotspot: HotspotData) => void;
  /** Set by the Scene when this hotspot sits within a label's width of a frame edge, so the
   *  label grows INWARD instead of being centred and clipped by the stage's overflow. Panning
   *  cannot solve this on its own: a hotspot near the image's own extreme edge (e.g. anchor.x
   *  0.06) can never be centred, because the pan clamp bottoms out first. */
  anchorSide?: 'left' | 'right' | null;
  /** tabIndex passthrough (Scene sets authored list order via natural DOM order; default 0). */
}

export function Hotspot({
  hotspot,
  onActivate,
  onFocus,
  collapsed,
  requireReveal,
  revealed,
  onReveal,
  anchorSide,
}: HotspotProps) {
  const { label, anchor, offset, target } = hotspot;
  const isExternal = target.type === 'external';
  // One tap short of navigating: show the label instead of firing the target.
  const pendingReveal = requireReveal === true && revealed !== true;

  // Anchor is normalized 0–1 on the full scene image; the parent box is that image. Offset
  // (if any) nudges the label in the same normalized space.
  const style: CSSProperties = {
    left: `${(anchor.x + (offset?.x ?? 0)) * 100}%`,
    top: `${(anchor.y + (offset?.y ?? 0)) * 100}%`,
  };

  const className = [
    'hotspot',
    collapsed ? 'hotspot--collapsed' : '',
    requireReveal ? 'hotspot--marker' : '',
    revealed ? 'hotspot--revealed' : '',
    anchorSide ? `hotspot--anchor-${anchorSide}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className="hotspot__label">{label}</span>
      {isExternal ? (
        <span className="hotspot__ext" aria-hidden="true">↗</span>
      ) : (
        <span className="hotspot__cue" aria-hidden="true">▸</span>
      )}
    </>
  );

  // Locked hotspots are reserved for future gating (§2) — default no-op: render, but inert.
  const disabled = hotspot.locked === true;

  // Should this activation only reveal the label? Keyboard activation (Enter/Space) reports
  // `detail === 0`, and CSS already reveals the label on :focus-visible — so a keyboard user has
  // read the label by the time they press Enter and must not be made to press it twice. Only
  // real pointer/touch taps pay the two-step. Deciding here, off the event, also sidesteps the
  // focus→click race on touch (focus fires first and would otherwise mark it already revealed).
  const shouldRevealOnly = (e: { detail: number }) => pendingReveal && e.detail !== 0;

  if (isExternal && target.type === 'external') {
    return (
      <div className={className} style={style}>
        <a
          className="hotspot__btn"
          href={target.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} (opens in a new tab)`}
          aria-disabled={disabled || undefined}
          onFocus={() => onFocus?.(hotspot)}
          onClick={(e) => {
            if (shouldRevealOnly(e)) {
              e.preventDefault();
              onReveal?.(hotspot);
              return;
            }
            // Report the activation, then fall through to the anchor's own navigation — no
            // preventDefault, so the new tab still opens exactly as before.
            onActivate(hotspot);
          }}
        >
          {inner}
        </a>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <button
        type="button"
        className="hotspot__btn"
        aria-label={label}
        disabled={disabled}
        onClick={(e) => {
          if (shouldRevealOnly(e)) {
            onReveal?.(hotspot);
            return;
          }
          onActivate(hotspot);
        }}
        onFocus={() => onFocus?.(hotspot)}
      >
        {inner}
      </button>
    </div>
  );
}
