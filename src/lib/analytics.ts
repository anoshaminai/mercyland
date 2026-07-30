// Mercy Land — analytics (specs/analytics.md)
// THE provider boundary. This is the ONLY file in the app that names Umami — components import
// `track` and nothing else, so swapping tools later changes this file and touches no components
// (same pattern as lib/email-signup.ts and Formspree).
//
// Cookieless by design: no consent banner, and NO PII ever — event props are ids and enums drawn
// straight from the data model (SceneId, ContentId, Hotspot.id). Never pass free-text user input.
//
// The script tag lives in index.html and is configured by VITE_UMAMI_SRC / VITE_UMAMI_ID. Those
// are unset in local dev, so `window.umami` is undefined and `track` degrades to the DEV log
// below — which is also how you verify instrumentation without touching production numbers.

export type TrackProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, props?: TrackProps) => void };
  }
}

export function track(event: string, props: TrackProps = {}): void {
  if (import.meta.env.DEV) console.debug('[analytics]', event, props);
  // The one and only place the provider is named:
  window.umami?.track(event, props);
}
