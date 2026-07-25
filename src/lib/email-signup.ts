// Mercy Land — email signup: the single provider integration module (spec v4 §8).
// ALL provider communication lives here. The form component calls only submitEmailSignup() and
// knows nothing about Formspree, the endpoint, or the response shape. Swapping providers later
// (Kit, Sender, etc. — see v2-site.md "Future expansions") changes this one file and touches no UI.

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mldnjygq';

export type SignupResult = { ok: true } | { ok: false; error: string };

export async function submitEmailSignup(email: string): Promise<SignupResult> {
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as { errors?: { message?: string }[] } | null;
    return { ok: false, error: data?.errors?.[0]?.message ?? 'something went wrong — try again' };
  } catch {
    return { ok: false, error: 'network error — check your connection and try again' };
  }
}
