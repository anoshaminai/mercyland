// Mercy Land — House World: flagStatement content (scene panel · flag_void)
// Renders the band statement (band-authored text in content-registry.tsx) as paragraphs.
// Persistent panel content — no dismiss, no assumption about being the only thing on screen.

import { flagStatement } from '../../../data/content-registry';

export function FlagStatement() {
  const paragraphs = flagStatement.split('\n\n');
  return (
    <div className="flag-statement">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
