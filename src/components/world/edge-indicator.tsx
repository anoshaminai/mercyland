// Mercy Land — House World: EdgeIndicator (spec v4 §5)
// The VISUAL affordance for a hotspot outside the current (mobile) viewport. It is NOT a
// separate control: it is aria-hidden and out of tab order, because the real focusable hotspot
// button already exists in the DOM at its anchored position. Tapping an edge indicator PANS the
// viewport to bring the hotspot into view — it never activates the hotspot (§5: "move the camera"
// and "open the thing" are two separate gestures). Uses the same scrim + label vocabulary as a
// hotspot so it reads as the same kind of object, parked at the frame with a chevron.

import type { CSSProperties } from 'react';
import type { Hotspot } from '../../types/world.types';

export interface EdgeIndicatorProps {
  hotspot: Hotspot;
  side: 'left' | 'right';
  /** Vertical position within the stage, in px (closest point to the true anchor). */
  top: number;
  /** Pan the viewport until this hotspot is comfortably in view. */
  onPan: (hotspot: Hotspot) => void;
}

export function EdgeIndicator({ hotspot, side, top, onPan }: EdgeIndicatorProps) {
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
      onClick={() => onPan(hotspot)}
    >
      <span aria-hidden="true">{chevron}</span>
      <span>{label}</span>
    </button>
  );
}
