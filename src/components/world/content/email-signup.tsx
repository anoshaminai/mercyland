// Mercy Land — House World: emailSignup content (scene panel · mailbox, spec v4 §8)
// The form owns its own states (idle · submitting · success · error) — the host (ScenePanel or,
// later, an overlay) neither knows nor manages them. Success stays in-world (renders in place).
// Provider talk goes through submitEmailSignup() ONLY; this component never mentions Formspree.
// Real accessible markup: labeled input, type=email, inline validation announced to assistive tech.

import { useRef, useState } from 'react';
import { validateEmail } from '../../../lib/validate-email';
import { submitEmailSignup } from '../../../lib/email-signup';

type Status = 'idle' | 'submitting' | 'error';

export function EmailSignup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const clearErrors = () => {
    if (error) setError(null);
    if (suggestion) setSuggestion(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateEmail(email);
    if (!result.ok) {
      setError(result.reason);
      setSuggestion(result.suggestion ?? null);
      return;
    }
    setStatus('submitting');
    setError(null);
    setSuggestion(null);
    const outcome = await submitEmailSignup(result.value);
    if (outcome.ok) {
      setSucceeded(true);
    } else {
      setStatus('error');
      setError(outcome.error);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setEmail(suggestion);
    setSuggestion(null);
    setError(null);
    inputRef.current?.focus();
  };

  if (succeeded) {
    return (
      <p className="signup__success" role="status">
        the void will call you soon
      </p>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form className="signup" onSubmit={onSubmit} noValidate>
      <p className="panel-heading" style={{ marginBottom: 0 }}>
        hear from Mercy Land
      </p>
      <p className="signup__consent">
        Join the list for new music, shows, and messages from the band. No spam — leave whenever
        you like.
      </p>

      <div className="signup__row">
        <label className="signup__label" htmlFor="mailbox-email">
          your email
        </label>
        <input
          ref={inputRef}
          id="mailbox-email"
          className="signup__input"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          disabled={submitting}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'mailbox-email-error' : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            clearErrors();
          }}
        />
      </div>

      {error ? (
        <p className="signup__error" id="mailbox-email-error" role="alert">
          {error}
          {suggestion ? (
            <>
              {' — did you mean '}
              <button type="button" className="signup__suggest" onClick={applySuggestion}>
                {suggestion}
              </button>
              ?
            </>
          ) : null}
        </p>
      ) : null}

      <button type="submit" className="signup__submit" disabled={submitting}>
        {submitting ? 'sending…' : 'join the list'}
      </button>
    </form>
  );
}
