// Mercy Land — House World: OverlayShell (spec v4 §4)
// THE overlay. There is one, not several. It is identical for every content id — how it opens,
// traps focus, dismisses (Esc + backdrop), locks scene scroll, and where it sits are the same
// whatever renders inside. Content-level state lives in the content component; the shell neither
// knows nor cares. Render it ONLY while open so its children (iframes) unmount on close — the
// single most important rule of the embedded-media contract (#1: unmount, never hide).

import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ContentId, SceneId } from '../../types/world.types';
import { useTrackOnce } from '../../hooks/use-track-once';
import '../../styles/world.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export interface OverlayShellProps {
  onClose: () => void;
  children: ReactNode;
  /** The content being shown. Doubles as the dialog's accessible name and the analytics label. */
  content: ContentId;
  /** The scene the overlay was opened from (analytics — which room leads to which media). */
  scene: SceneId;
}

export function OverlayShell({ onClose, children, content, scene }: OverlayShellProps) {
  // Analytics: the shell is mounted ONLY while open, so mount == open (specs/analytics.md).
  useTrackOnce('overlay_open', { scene, content }, `${scene}:${content}`);

  const panelRef = useRef<HTMLDivElement>(null);
  const dismissRef = useRef<HTMLButtonElement>(null);

  // Lock scene scroll behind the overlay; restore on close (contract #4).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Move focus in on open; restore to the trigger on close (accessibility).
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dismissRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);

  // Esc to dismiss + a Tab focus trap. The dismiss control is a non-iframe element and is the
  // first focusable, so Esc-to-close stays reachable even with embeds present (contract #5).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return createPortal(
    <div
      className="overlay__backdrop"
      onMouseDown={(e) => {
        // Backdrop dismiss — only when the press starts on the backdrop itself, not the panel.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label={content}
        onKeyDown={onKeyDown}
      >
        <button
          ref={dismissRef}
          type="button"
          className="overlay__dismiss"
          aria-label="close"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="overlay__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
