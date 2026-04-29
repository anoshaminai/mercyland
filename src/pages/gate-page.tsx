import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { useChatWorldAccess } from '../hooks/useChatWorldAccess';
import { validateEmail } from '../lib/validate-email';

export const GatePage = () => {
  const navigate = useNavigate();
  const { hasAccess, rememberedEmail, grantAccess } = useChatWorldAccess();
  const [state, handleSubmit] = useForm('mldnjygq');
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(rememberedEmail ?? '');
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (hasAccess) navigate('/chat-world', { replace: true });
  }, [hasAccess, navigate]);

  useEffect(() => {
    if (state.succeeded) {
      grantAccess(email);
      const t = window.setTimeout(() => navigate('/chat-world'), 800);
      return () => window.clearTimeout(t);
    }
  }, [state.succeeded, grantAccess, navigate, email]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const result = validateEmail(email);
    if (!result.ok) {
      e.preventDefault();
      setError(result.reason);
      setSuggestion(result.suggestion ?? null);
      return;
    }
    setError(null);
    setSuggestion(null);
    handleSubmit(e);
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setEmail(suggestion);
    setError(null);
    setSuggestion(null);
    inputRef.current?.focus();
  };

  return (
    <div className="w-screen h-screen bg-mercy-black flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 max-w-[560px] w-full">
        <h1 className="text-mercy-pink font-secondary text-4xl md:text-5xl text-center">
          chat world
        </h1>
        <p className="text-mercy-white font-primary text-sm md:text-base text-center opacity-80">
          leave your email to enter
        </p>

        {state.succeeded ? (
          <div className="flex justify-center items-center bg-mercy-blue border border-mercy-pink max-w-[500px] w-full">
            <span className="text-mercy-pink font-primary px-4 py-2 text-center">
              fetching your messages...
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <form
              onSubmit={onSubmit}
              className="flex justify-center items-center bg-mercy-blue border border-mercy-pink w-full"
            >
              <input
                ref={inputRef}
                id="email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                  if (suggestion) setSuggestion(null);
                }}
                placeholder="YOUR EMAIL"
                className="bg-mercy-blue text-mercy-white font-primary px-3 py-2 outline-none border-r border-mercy-pink flex-1 min-w-0"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-mercy-red px-2"
              />
              <button
                type="submit"
                disabled={state.submitting}
                className="bg-mercy-blue text-mercy-pink font-primary px-4 py-2 hover:text-mercy-white transition-colors disabled:opacity-50"
              >
                ENTER
              </button>
            </form>
            {error && (
              <p className="text-mercy-red font-primary text-xs self-start">
                {error}
                {suggestion && (
                  <>
                    {' — did you mean '}
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="underline text-mercy-pink hover:text-mercy-white transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                    ?
                  </>
                )}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/void')}
          className="text-mercy-white/60 font-primary text-xs hover:text-mercy-white transition-colors cursor-pointer"
        >
          ← back to the void
        </button>
      </div>
    </div>
  );
};
