// Mercy Land — House World: EdgeIndicator (spec v4 §5)
// The VISUAL affordance for a hotspot outside the current (mobile) viewport. It is NOT a
// separate control: it is aria-hidden and out of tab order, because the real focusable hotspot
// button already exists in the DOM at its anchored position. Tapping an edge indicator SUMMONS
// the hotspot: pans it into view AND leaves its label open. It never activates the hotspot (§5:
// "move the camera" and "open the thing" stay two separate gestures) — the summoned hotspot is
// revealed, so one further tap commits.
//
// Carrying the reveal across is the whole point: this indicator is labelled, so by the time you
// tap it you have already read what the thing is. Landing you on an anonymous marker that needs
// another tap to re-read the same label loses information you already had. (Same reasoning as
// Hotspot's keyboard exemption in `shouldRevealOnly`.)

import type { CSSProperties } from 'react';
import type { Hotspot } from '../../types/world.types';

export interface EdgeIndicatorProps {
  hotspot: Hotspot;
  side: 'left' | 'right';
  /** Vertical position within the stage, in px. The Scene resolves this from the true anchor,
   *  then de-overlaps the stack on each side (§5). */
  top: number;
  /** Bring this hotspot into view and leave its label open. Never activates it. */
  onSummon: (hotspot: Hotspot) => void;
}

export function EdgeIndicator({ hotspot, side, top, onSummon }: EdgeIndicatorProps) {
  const label = hotspot.labelShort ?? hotspot.label;
  const chevron = side === 'left' ? '‹' : '›';
  const style: CSSProperties = { top };

  return (
    <button
      type="button"
      className={`edge-indicator edge-indicator--${side}`}
      style={style}
      aria-hidden="true"
      tabIndex={-1}
      onClick={() => onSummon(hotspot)}
    >
      <span aria-hidden="true">{chevron}</span>
      <span>{label}</span>
    </button>
  );
}
