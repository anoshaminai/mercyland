// Mercy Land — House World: monsterDenied content (overlay · house_monster "go home")
// Registry content is written once and must NOT assume it is dismissible or the only thing on
// screen (spec §4) — so it renders the message only; the host (OverlayShell) owns dismissal.

export function MonsterDenied() {
  return (
    <p
      style={{
        fontFamily: 'var(--font-secondary)',
        fontSize: '1.4rem',
        lineHeight: 1.5,
        textAlign: 'center',
        margin: 0,
      }}
    >
      You&rsquo;re not ready to go home &lt;3
    </p>
  );
}
